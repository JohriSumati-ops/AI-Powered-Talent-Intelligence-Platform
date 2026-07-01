from src.models.jd_models import ParsedJD
from src.models.candidate_models import Candidate
from src.models.comparison_models import CompareResponse
from src.services.ranking_service import score_candidate


def _winner(a: float, b: float, threshold: float = 1.0) -> str:
    """
    Returns which candidate wins a metric.
    """
    if abs(a - b) <= threshold:
        return "Tie"

    return "Candidate A" if a > b else "Candidate B"


def compare_candidates(
    jd: ParsedJD,
    candidate_a: Candidate,
    candidate_b: Candidate,
) -> CompareResponse:

    score_a = score_candidate(jd, candidate_a)
    score_b = score_candidate(jd, candidate_b)

    comparison = {
        "skill": _winner(
            score_a.skill_score,
            score_b.skill_score,
        ),
        "experience": _winner(
            score_a.experience_score,
            score_b.experience_score,
        ),
        "trajectory": _winner(
            score_a.trajectory_score,
            score_b.trajectory_score,
        ),
        "behavior": _winner(
            score_a.behavior_score,
            score_b.behavior_score,
        ),
        "potential": _winner(
            score_a.potential_score,
            score_b.potential_score,
        ),
        "overall": _winner(
            score_a.final_score,
            score_b.final_score,
        ),
    }

    winner = (
        candidate_a.name
        if score_a.final_score >= score_b.final_score
        else candidate_b.name
    )

    reason = (
        f"{winner} ranked higher because of a stronger overall score.\n\n"
        f"{candidate_a.name}: {score_a.final_score}/100\n"
        f"{candidate_b.name}: {score_b.final_score}/100\n\n"
        f"Skill Match: {score_a.skill_score:.1f} vs {score_b.skill_score:.1f}\n"
        f"Experience: {score_a.experience_score:.1f} vs {score_b.experience_score:.1f}\n"
        f"Career Trajectory: {score_a.trajectory_score:.1f} vs {score_b.trajectory_score:.1f}\n"
        f"Behavior Signals: {score_a.behavior_score:.1f} vs {score_b.behavior_score:.1f}\n"
        f"Hidden Potential: {score_a.potential_score:.1f} vs {score_b.potential_score:.1f}"
    )

    return CompareResponse(
        winner=winner,
        comparison=comparison,
        reason=reason,
    )