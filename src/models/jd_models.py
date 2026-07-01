from typing import Literal

from pydantic import BaseModel, Field


class JDInput(BaseModel):
    """Raw job description text submitted by the recruiter."""
    jd_text: str


class ParsedJD(BaseModel):
    # ---------- Phase 1 ----------
    title: str | None = None
    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)
    min_experience_years: int | None = None
    responsibilities: list[str] = Field(default_factory=list)
    raw_text: str

    # ---------- Phase 4 ----------
    seniority: (
        Literal[
            "Junior",
            "Mid",
            "Senior",
            "Staff",
            "Principal",
            "Executive",
        ]
        | None
    ) = None

    domain: str | None = None

    team_type: (
        Literal[
            "IC",
            "Lead",
            "Managerial",
            "Cross-functional",
            "Founding",
        ]
        | None
    ) = None

    culture_signals: list[str] = Field(default_factory=list)

    startup_readiness_required: bool | None = None

    ambiguity_tolerance_required: (
        Literal[
            "Low",
            "Medium",
            "High",
        ]
        | None
    ) = None

    jd_quality_notes: str | None = None