import logging
from typing import Optional

from src.models.retrieval_models import (
    CandidateEmbeddingRecord,
    RetrieveRequest,
    RetrieveResponse,
    RetrievedCandidate,
)
from src.services.embedding_service import get_embedding_service
from src.services.vector_db_service import VectorDBService

logger = logging.getLogger(__name__)

_vector_db: Optional[VectorDBService] = None


def _get_vector_db(dimension: int) -> VectorDBService:
    """
    Returns a singleton FAISS database instance.
    Loads the persisted index if available.
    """
    global _vector_db

    if _vector_db is None:
        _vector_db = VectorDBService(dimension=dimension)

        try:
            loaded = _vector_db.load()

            if loaded:
                logger.info("Loaded persisted FAISS index.")
            else:
                logger.info("No persisted FAISS index found.")
        except Exception as e:
            logger.warning(f"Unable to load FAISS index: {e}")

    return _vector_db


class RetrievalService:
    """
    Semantic candidate retrieval using SentenceTransformers + FAISS.
    """

    def __init__(self):
        self.embedding_service = get_embedding_service()

    def retrieve(self, request: RetrieveRequest) -> RetrieveResponse:
        """
        Retrieve the most relevant candidates for a job description.
        """

        jd_vector = self.embedding_service.embed_text(
            request.job_description
        )

        db = _get_vector_db(
            dimension=self.embedding_service.dimension
        )

        # Build temporary index if caller supplied candidates
        if request.candidates:
            db = self._build_ephemeral_index(
                request.candidates
            )

        raw_results = db.search(
            jd_vector,
            top_k=request.top_k,
        )

        results = []

        for rank, (metadata, similarity) in enumerate(
            raw_results,
            start=1,
        ):
            results.append(
                RetrievedCandidate(
                    candidate_id=metadata.get("candidate_id", ""),
                    name=metadata.get("name", ""),
                    similarity_score=round(float(similarity), 4),
                    rank=rank,
                )
            )

        return RetrieveResponse(
            query_preview=request.job_description[:200],
            total_candidates_searched=db.total_vectors,
            top_k=request.top_k,
            results=results,
        )

    def _build_ephemeral_index(
        self,
        candidates: list[CandidateEmbeddingRecord],
    ) -> VectorDBService:
        """
        Builds an in-memory FAISS index for the supplied candidate list.
        """

        texts = [
            c.resume_text
            for c in candidates
        ]

        vectors = self.embedding_service.embed_batch(texts)

        metadata = [
            {
                "candidate_id": c.candidate_id,
                "name": c.name,
            }
            for c in candidates
        ]

        db = VectorDBService(
            dimension=self.embedding_service.dimension
        )

        db.build_index(
            vectors=vectors,
            metadata=metadata,
        )

        return db

    def index_candidates(
        self,
        candidates: list[CandidateEmbeddingRecord],
        persist: bool = True,
    ) -> int:
        """
        Adds candidates to the persistent FAISS index.
        """

        texts = [
            c.resume_text
            for c in candidates
        ]

        vectors = self.embedding_service.embed_batch(texts)

        metadata = [
            {
                "candidate_id": c.candidate_id,
                "name": c.name,
            }
            for c in candidates
        ]

        db = _get_vector_db(
            dimension=self.embedding_service.dimension
        )

        db.add(
            vectors=vectors,
            metadata=metadata,
        )

        if persist:
            db.save()

        logger.info(
            "Indexed %d candidates. Total indexed: %d",
            len(candidates),
            db.total_vectors,
        )

        return db.total_vectors