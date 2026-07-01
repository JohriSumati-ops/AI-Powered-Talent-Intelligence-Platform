from fastapi import APIRouter, HTTPException

from src.models.jd_models import JDInput, ParsedJD
from src.services.jd_parser_service import parse_job_description

router = APIRouter(tags=["Job Description"])


@router.post("/parse-jd", response_model=ParsedJD)
def parse_jd_endpoint(payload: JDInput):
    if not payload.jd_text or len(payload.jd_text.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Job description text is too short to parse.",
        )

    return parse_job_description(payload.jd_text)