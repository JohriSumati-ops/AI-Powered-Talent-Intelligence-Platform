from pydantic import BaseModel, Field
from typing import Literal, Optional
from src.models.jd_models import ParsedJD
class Candidate(BaseModel):
    candidate_id: str
    name: str
    title: str
    skills: list[str]
    experience_years: int
    past_roles: list[str]
    role_progression: list[str]
    github_activity_score: int = Field(ge=0, le=100)
    certifications: list[str]
    hackathons: int
    learning_consistency_score: int = Field(ge=0, le=100)
    bio: str





class DimensionExplanations(BaseModel):
    skill_match: str
    experience_relevance: str
    career_trajectory: str
    behavioral_signals: str
    hidden_potential: str


class Explanation(BaseModel):
    dimension_explanations: DimensionExplanations
    overall_summary: str
    standout_strengths: list[str] = []
    key_risks: list[str] = []
    recommendation: Literal["Strong Hire", "Hire", "Interview Further", "Pass"]

class CandidateScore(BaseModel):
    candidate_id: str
    name: str
    skill_score: float
    experience_score: float
    trajectory_score: float
    behavior_score: float
    potential_score: float
    final_score: float
    current_fit: float
    future_fit: float
    explanation: Explanation


class RankRequest(BaseModel):
    parsed_jd: ParsedJD
    candidates: list[Candidate]
    query: Optional[str] = None


class ExplainRequest(BaseModel):
    parsed_jd: ParsedJD
    candidate: Candidate


class QueryRequest(BaseModel):
    """Natural language query used to re-rank/filter an existing candidate pool."""
    parsed_jd: ParsedJD
    candidates: list[Candidate]
    natural_query: str