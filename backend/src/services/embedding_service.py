import hashlib
import logging
import os
from functools import lru_cache

import numpy as np
from sentence_transformers import SentenceTransformer

from src.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_MODEL_NAME = settings.EMBEDDING_MODEL_NAME
_CACHE_DIR = getattr(settings, "EMBEDDING_CACHE_DIR", "data/embedding_cache")

os.makedirs(_CACHE_DIR, exist_ok=True)


class EmbeddingService:
    """
    Singleton wrapper around SentenceTransformer with simple disk caching.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        logger.info(f"Loading embedding model: {_MODEL_NAME}")
        self.model = SentenceTransformer(_MODEL_NAME)
        self.dimension = self.model.get_sentence_embedding_dimension()

    @staticmethod
    def _hash_text(text: str) -> str:
        return hashlib.sha256(text.strip().encode("utf-8")).hexdigest()

    def _cache_path(self, text_hash: str) -> str:
        return os.path.join(_CACHE_DIR, f"{text_hash}.npy")

    def embed_text(self, text: str, use_cache: bool = True) -> np.ndarray:
        """
        Returns a normalized embedding for a single text.
        """
        if not text or not text.strip():
            return np.zeros(self.dimension, dtype=np.float32)

        text_hash = self._hash_text(text)
        cache_path = self._cache_path(text_hash)

        if use_cache and os.path.exists(cache_path):
            return np.load(cache_path)

        vector = self.model.encode(
            text,
            normalize_embeddings=True,
            convert_to_numpy=True,
        ).astype(np.float32)

        if use_cache:
            np.save(cache_path, vector)

        return vector

    def embed_batch(
        self,
        texts: list[str],
        use_cache: bool = True,
    ) -> np.ndarray:
        """
        Returns embeddings for multiple texts.
        """
        if not texts:
            return np.empty((0, self.dimension), dtype=np.float32)

        results = [None] * len(texts)
        compute_idx = []
        compute_texts = []

        for i, text in enumerate(texts):
            text_hash = self._hash_text(text)
            cache_path = self._cache_path(text_hash)

            if use_cache and os.path.exists(cache_path):
                results[i] = np.load(cache_path)
            else:
                compute_idx.append(i)
                compute_texts.append(text)

        if compute_texts:
            vectors = self.model.encode(
                compute_texts,
                normalize_embeddings=True,
                convert_to_numpy=True,
                batch_size=32,
                show_progress_bar=False,
            )

            for idx, vec, txt in zip(compute_idx, vectors, compute_texts):
                vec = np.asarray(vec, dtype=np.float32)
                results[idx] = vec

                if use_cache:
                    np.save(
                        self._cache_path(self._hash_text(txt)),
                        vec,
                    )

        return np.vstack(results).astype(np.float32)


@lru_cache(maxsize=1)
def get_embedding_service() -> EmbeddingService:
    return EmbeddingService()


# ---------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------

def semantic_similarity(text1: str, text2: str) -> float:
    """
    Cosine similarity between two text strings.
    Returns a value between 0 and 1.
    """

    service = get_embedding_service()

    v1 = service.embed_text(text1)
    v2 = service.embed_text(text2)

    score = float(np.dot(v1, v2))

    return max(0.0, min(1.0, score))


def list_semantic_match_score(
    required_items: list[str],
    candidate_items: list[str],
) -> float:
    """
    Measures how well candidate_items satisfy required_items.

    Each required skill is matched against the best candidate skill.
    """

    if not required_items:
        return 1.0

    if not candidate_items:
        return 0.0

    matches = []

    for required in required_items:
        best = 0.0

        for candidate in candidate_items:
            similarity = semantic_similarity(required, candidate)

            if similarity > best:
                best = similarity

        matches.append(best)

    return round(float(np.mean(matches)), 4)