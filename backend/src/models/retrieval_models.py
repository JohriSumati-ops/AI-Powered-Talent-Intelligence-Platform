from pydantic import BaseModel, Field
from typing import List, Optional


class CandidateEmbeddingRecord(BaseModel):
    candidate_id: str
    name: Optional[str] = None
    resume_text: str


class RetrieveRequest(BaseModel):
    job_description: str = Field(..., description="Raw or parsed JD text to search against")
    top_k: int = Field(10, ge=1, le=100)
    candidates: Optional[List[CandidateEmbeddingRecord]] = Field(
        None,
        description="Optional candidate pool to index on-the-fly. If omitted, uses the persisted FAISS index."
    )


class RetrievedCandidate(BaseModel):
    candidate_id: str
    name: Optional[str] = None
    similarity_score: float
    rank: int


class RetrieveResponse(BaseModel):
    query_preview: str
    total_candidates_searched: int
    top_k: int
    results: List[RetrievedCandidate]