from fastapi import APIRouter

from src.models.chat_models import (
    ChatRequest,
    ChatResponse,
)
from src.services.chat_service import recruiter_chat

router = APIRouter()


@router.post(
    "",
    response_model=ChatResponse,
)
def chat(request: ChatRequest):

    answer = recruiter_chat(
        request.parsed_jd,
        request.candidates,
        request.question,
    )

    return ChatResponse(
        answer=answer,
    )