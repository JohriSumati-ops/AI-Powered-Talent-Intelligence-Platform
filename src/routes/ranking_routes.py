from fastapi import APIRouter, HTTPException
from src.models.candidate_models import RankRequest, CandidateScore
from src.services.ranking_service import rank_candidates

router = APIRouter(tags=["ranking"])


@router.post("/rank", response_model=list[CandidateScore])
def rank_endpoint(payload: RankRequest):
    if not payload.candidates:
        raise HTTPException(status_code=400, detail="No candidates provided.")
    return rank_candidates(payload.parsed_jd, payload.candidates)