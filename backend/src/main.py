from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routes.jd_routes import router as jd_router
from src.routes.ranking_routes import router as ranking_router
from src.routes.retrieval_routes import router as retrieval_router
from src.routes.chat_routes import router as chat_router
from src.routes.comparison_routes import router as compare_router

app = FastAPI(
    title="Talent Intelligence Engine",
    version="2.0.0",
    description="AI-powered Talent Intelligence Engine with JD Parsing, Candidate Ranking, Semantic Retrieval, Recruiter Chat, and Candidate Comparison.",
)

# ----------------------------
# CORS
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Routes
# ----------------------------
app.include_router(
    jd_router,
    prefix="/jd",
    tags=["JD Parser"],
)

app.include_router(
    ranking_router,
    prefix="/ranking",
    tags=["Ranking"],
)

app.include_router(
    retrieval_router,
    prefix="/retrieval",
    tags=["Semantic Retrieval"],
)

app.include_router(
    chat_router,
    prefix="/chat",
    tags=["Recruiter AI"],
)

app.include_router(
    compare_router,
    prefix="/compare",
    tags=["Candidate Comparison"],
)


@app.get("/")
def root():
    return {
        "message": "Talent Intelligence Engine API is running",
        "version": "2.0.0",
        "features": [
            "JD Parsing",
            "Candidate Ranking",
            "Semantic Retrieval (FAISS)",
            "AI Recruiter Chat",
            "Candidate Comparison",
        ],
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Talent Intelligence Engine",
    }