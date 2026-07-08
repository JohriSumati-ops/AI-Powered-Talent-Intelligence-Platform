import os
from functools import lru_cache
from dotenv import load_dotenv, find_dotenv

# ==========================================================
# Load .env
# ==========================================================

dotenv_path = find_dotenv()

print("=" * 70)
print("CONFIG INITIALIZATION")
print("Current Working Directory :", os.getcwd())
print("Dotenv Path               :", dotenv_path)

if dotenv_path:
    load_dotenv(dotenv_path, override=True)
    print("Status                    : .env loaded successfully")
else:
    print("Status                    : .env NOT FOUND")

print("Environment GROQ_API_KEY  :", repr(os.getenv("GROQ_API_KEY")))
print("=" * 70)


class Settings:

    def __init__(self):

        # ==================================================
        # App
        # ==================================================

        self.APP_NAME = "Talent Intelligence Engine"
        self.APP_VERSION = "2.0.0"
        self.ENV = os.getenv("ENV", "development")

        # ==================================================
        # Groq
        # ==================================================

        self.GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

        self.GROQ_MODEL = os.getenv(
            "GROQ_MODEL",
            "llama-3.1-70b-versatile"
        )

        self.LLM_TEMPERATURE = float(
            os.getenv("LLM_TEMPERATURE", "0.3")
        )

        self.LLM_MAX_TOKENS = int(
            os.getenv("LLM_MAX_TOKENS", "1024")
        )

        # ==================================================
        # Embeddings
        # ==================================================

        self.EMBEDDING_MODEL_NAME = os.getenv(
            "EMBEDDING_MODEL_NAME",
            "all-MiniLM-L6-v2"
        )

        self.EMBEDDING_CACHE_DIR = os.getenv(
            "EMBEDDING_CACHE_DIR",
            "data/embedding_cache"
        )

        # ==================================================
        # FAISS
        # ==================================================

        self.FAISS_INDEX_DIR = os.getenv(
            "FAISS_INDEX_DIR",
            "data/faiss_index"
        )

        self.VECTOR_DIM = int(
            os.getenv("VECTOR_DIM", "384")
        )

        self.DEFAULT_TOP_K = int(
            os.getenv("DEFAULT_TOP_K", "5")
        )

        # ==================================================
        # Sessions
        # ==================================================

        self.SESSION_STORE_PATH = os.getenv(
            "SESSION_STORE_PATH",
            "data/sessions"
        )

        # ==================================================
        # CORS
        # ==================================================

        self.ALLOWED_ORIGINS = os.getenv(
            "ALLOWED_ORIGINS",
            "*"
        ).split(",")

        # ==================================================
        # Debug
        # ==================================================

        print("\nSettings Loaded")
        print("APP_NAME        :", self.APP_NAME)
        print("APP_VERSION     :", self.APP_VERSION)
        print("GROQ_MODEL      :", self.GROQ_MODEL)
        print("GROQ_API_KEY    :", repr(self.GROQ_API_KEY))
        print("EMBEDDING_MODEL :", self.EMBEDDING_MODEL_NAME)
        print()


@lru_cache()
def get_settings():
    return Settings()