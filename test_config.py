from src.config import get_settings

settings = get_settings()

print("API KEY:", settings.GROQ_API_KEY)
print("MODEL:", settings.GROQ_MODEL)