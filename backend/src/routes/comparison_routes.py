from fastapi import APIRouter

from src.models.comparison_models import (
    CompareRequest,
    CompareResponse,
)
from src.services.comparison_service import compare_candidates

router = APIRouter()


@router.post(
    "",
    response_model=CompareResponse,
)
def compare(request: CompareRequest):

    return compare_candidates(
        request.parsed_jd,
        request.candidate_a,
        request.candidate_b,
    )