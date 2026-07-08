import os
import pickle
from typing import List, Tuple, Optional

import faiss
import numpy as np

from src.utils.logger import get_logger
from src.config import get_settings

settings = get_settings()
logger = get_logger(__name__)

_INDEX_DIR = getattr(settings, "FAISS_INDEX_DIR", "data/faiss_index")
_INDEX_PATH = os.path.join(_INDEX_DIR, "candidates.index")
_METADATA_PATH = os.path.join(_INDEX_DIR, "candidates_meta.pkl")

os.makedirs(_INDEX_DIR, exist_ok=True)


class VectorDBService:
    """
    Thin wrapper around a FAISS IndexFlatIP (cosine similarity via normalized
    vectors). Supports building an ephemeral in-memory index for a single
    request, or persisting/loading a long-lived index to disk.
    """

    def __init__(self, dimension: int):
        self.dimension = dimension
        self.index: Optional[faiss.Index] = None
        self.metadata: List[dict] = []  # parallel list: metadata[i] <-> index vector i

    def build_index(self, vectors: np.ndarray, metadata: List[dict]):
        if vectors.shape[0] != len(metadata):
            raise ValueError("vectors and metadata length mismatch")

        self.index = faiss.IndexFlatIP(self.dimension)
        self.index.add(vectors.astype(np.float32))
        self.metadata = metadata
        logger.info(f"Built FAISS index with {self.index.ntotal} vectors")

    def add(self, vectors: np.ndarray, metadata: List[dict]):
        if self.index is None:
            self.build_index(vectors, metadata)
            return
        self.index.add(vectors.astype(np.float32))
        self.metadata.extend(metadata)

    def search(self, query_vector: np.ndarray, top_k: int) -> List[Tuple[dict, float]]:
        if self.index is None or self.index.ntotal == 0:
            return []

        query_vector = query_vector.reshape(1, -1).astype(np.float32)
        k = min(top_k, self.index.ntotal)
        scores, indices = self.index.search(query_vector, k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:
                continue
            results.append((self.metadata[idx], float(score)))
        return results

    def save(self):
        if self.index is None:
            raise RuntimeError("No index to save")
        faiss.write_index(self.index, _INDEX_PATH)
        with open(_METADATA_PATH, "wb") as f:
            pickle.dump(self.metadata, f)
        logger.info(f"Saved FAISS index to {_INDEX_PATH}")

    def load(self) -> bool:
        if not os.path.exists(_INDEX_PATH) or not os.path.exists(_METADATA_PATH):
            return False
        self.index = faiss.read_index(_INDEX_PATH)
        with open(_METADATA_PATH, "rb") as f:
            self.metadata = pickle.load(f)
        logger.info(f"Loaded FAISS index with {self.index.ntotal} vectors")
        return True

    @property
    def total_vectors(self) -> int:
        return self.index.ntotal if self.index else 0