import json
from typing import List
import os
import sys

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
from src.models.candidate_models import Candidate


def _safe_int(value, default=0):
    try:
        return int(float(value))
    except Exception:
        return default


def _extract_skills(candidate_json) -> List[str]:
    return [
        skill.get("name", "")
        for skill in candidate_json.get("skills", [])
        if skill.get("name")
    ]


def _extract_past_roles(candidate_json) -> List[str]:
    return [
        role.get("title", "")
        for role in candidate_json.get("career_history", [])
        if role.get("title")
    ]


def _extract_role_progression(candidate_json) -> List[str]:
    history = candidate_json.get("career_history", [])

    # oldest -> newest
    history = sorted(
        history,
        key=lambda x: x.get("start_date", "")
    )

    return [
        role.get("title", "")
        for role in history
        if role.get("title")
    ]


def _extract_certifications(candidate_json) -> List[str]:
    certs = candidate_json.get("certifications", [])

    results = []

    for cert in certs:
        if isinstance(cert, dict):
            results.append(
                cert.get("name")
                or cert.get("title")
                or cert.get("certificate")
                or "Certification"
            )
        else:
            results.append(str(cert))

    return results


def convert_candidate(candidate_json) -> Candidate:
    profile = candidate_json.get("profile", {})
    signals = candidate_json.get("redrob_signals", {})

    github_score = signals.get("github_activity_score", 0)

    # backend expects 0-100
    github_score = int(float(github_score) * 10)

    learning_score = (
        signals.get("profile_completeness_score", 0)
        + signals.get("recruiter_response_rate", 0) * 100
    ) / 2

    return Candidate(
        candidate_id=candidate_json["candidate_id"],

        name=profile.get(
            "anonymized_name",
            "Unknown"
        ),

        title=profile.get(
            "current_title",
            ""
        ),

        skills=_extract_skills(candidate_json),

        experience_years=_safe_int(
            profile.get(
                "years_of_experience",
                0
            )
        ),

        past_roles=_extract_past_roles(candidate_json),

        role_progression=_extract_role_progression(candidate_json),

        github_activity_score=max(
            0,
            min(
                100,
                github_score
            )
        ),

        certifications=_extract_certifications(candidate_json),

        hackathons=0,

        learning_consistency_score=int(
            max(
                0,
                min(
                    100,
                    learning_score
                )
            )
        ),

        bio=profile.get(
            "summary",
            ""
        ),
    )


def load_candidates(json_path: str) -> List[Candidate]:
    with open(json_path, "r", encoding="utf-8") as f:
        raw = json.load(f)

    return [
        convert_candidate(candidate)
        for candidate in raw
    ]