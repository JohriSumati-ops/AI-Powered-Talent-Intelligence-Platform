from pydantic import BaseModel

from src.models.jd_models import ParsedJD
from src.models.candidate_models import Candidate


class CompareRequest(BaseModel):
    parsed_jd: ParsedJD
    candidate_a: Candidate
    candidate_b: Candidate


class CompareResponse(BaseModel):
    winner: str
    comparison: dict
    reason: str