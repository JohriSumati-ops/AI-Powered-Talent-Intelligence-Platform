from functools import lru_cache
from groq import Groq
from src.config import get_settings


@lru_cache
def get_groq_client() -> Groq:
    """
    Returns a singleton Groq client. Any service that needs LLM access
    (explain_service, comparison_service, chat_service, ...) should call
    this instead of instantiating its own `Groq(...)` client.
    """
    settings = get_settings()
    if not settings.GROQ_API_KEY:
        raise RuntimeError(
            "GROQ_API_KEY is not set. Add it to your environment or .env file."
        )
    return Groq(api_key=settings.GROQ_API_KEY)


def chat_completion(
    messages: list[dict],
    temperature: float | None = None,
    max_tokens: int | None = None,
    model: str | None = None,
) -> str:
    """
    Thin convenience wrapper around Groq's chat completion endpoint.
    Centralizing this means model/temperature/token defaults are changed
    in one place instead of in every service that calls the LLM.

    messages: list of {"role": "system"|"user"|"assistant", "content": str}
    """
    settings = get_settings()
    client = get_groq_client()

    response = client.chat.completions.create(
        model=model or settings.GROQ_MODEL,
        messages=messages,
        temperature=temperature if temperature is not None else settings.LLM_TEMPERATURE,
        max_tokens=max_tokens or settings.LLM_MAX_TOKENS,
    )
    return response.choices[0].message.content