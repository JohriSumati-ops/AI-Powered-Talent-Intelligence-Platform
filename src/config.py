import os
from functools import lru_cache


class Settings:
    # App
    APP_NAME = "Talent Intelligence Engine"
    APP_VERSION = "2.0.0"
    ENV = os.getenv("ENV", "development")

    # Groq
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
    LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", "0.3"))
    LLM_MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS", "1024"))

    # Embeddings
    EMBEDDING_MODEL_NAME = os.getenv(
        "EMBEDDING_MODEL_NAME",
        "all-MiniLM-L6-v2"
    )
    EMBEDDING_CACHE_DIR = os.getenv(
        "EMBEDDING_CACHE_DIR",
        "data/embedding_cache"
    )

    # FAISS
    FAISS_INDEX_DIR = os.getenv(
        "FAISS_INDEX_DIR",
        "data/faiss_index"
    )

    VECTOR_DIM = int(os.getenv("VECTOR_DIM", "384"))
    DEFAULT_TOP_K = int(os.getenv("DEFAULT_TOP_K", "5"))

    # Sessions
    SESSION_STORE_PATH = os.getenv(
        "SESSION_STORE_PATH",
        "data/sessions"
    )

    # CORS
    ALLOWED_ORIGINS = os.getenv(
        "ALLOWED_ORIGINS",
        "*"
    ).split(",")


@lru_cache
def get_settings():
    return Settings()