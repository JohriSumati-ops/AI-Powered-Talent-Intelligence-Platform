from pydantic import BaseModel

from src.models.jd_models import ParsedJD
from src.models.candidate_models import Candidate


class ChatRequest(BaseModel):
    parsed_jd: ParsedJD
    candidates: list[Candidate]
    question: str


class ChatResponse(BaseModel):
    answer: str