from fastapi import APIRouter, HTTPException

from src.models.retrieval_models import RetrieveRequest, RetrieveResponse
from src.services.retrieval_service import RetrievalService
from src.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(tags=["Retrieval"])

retrieval_service = RetrievalService()


@router.post("/retrieve", response_model=RetrieveResponse)
async def retrieve_candidates(payload: RetrieveRequest):
    try:
        return retrieval_service.retrieve(payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("Retrieval failed")
        raise HTTPException(status_code=500, detail="Internal retrieval error")