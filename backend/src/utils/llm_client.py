from functools import lru_cache
import traceback

from groq import Groq

from src.config import get_settings


@lru_cache
def get_groq_client() -> Groq:
    """
    Returns a singleton Groq client.
    """

    settings = get_settings()

    # ---------------- DEBUG ----------------
    print("\n" + "=" * 70)
    print("DEBUG: Initializing Groq Client")
    print("GROQ_API_KEY :", repr(settings.GROQ_API_KEY))
    print("GROQ_MODEL   :", settings.GROQ_MODEL)
    print("TEMPERATURE  :", settings.LLM_TEMPERATURE)
    print("MAX TOKENS   :", settings.LLM_MAX_TOKENS)
    print("=" * 70 + "\n")
    # ---------------------------------------

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
    Wrapper around the Groq Chat Completion API.
    """

    settings = get_settings()
    client = get_groq_client()

    try:
        response = client.chat.completions.create(
            model=model or settings.GROQ_MODEL,
            messages=messages,
            temperature=(
                temperature
                if temperature is not None
                else settings.LLM_TEMPERATURE
            ),
            max_tokens=(
                max_tokens
                if max_tokens is not None
                else settings.LLM_MAX_TOKENS
            ),
        )

        return response.choices[0].message.content

    except Exception as e:
        print("\n" + "=" * 70)
        print("ERROR CALLING GROQ")
        print(type(e).__name__)
        print(str(e))
        traceback.print_exc()
        print("=" * 70 + "\n")
        raise