from src.models.jd_models import ParsedJD
from src.models.candidate_models import (
    Candidate,
    CandidateScore,
    Explanation,
    DimensionExplanations,
)
from src.services.embedding_service import (
    list_semantic_match_score,
    semantic_similarity,
)


def score_skill_match(jd: ParsedJD, candidate: Candidate) -> float:
    required_score = list_semantic_match_score(
        jd.required_skills,
        candidate.skills,
    )

    preferred_score = (
        list_semantic_match_score(
            jd.preferred_skills,
            candidate.skills,
        )
        if jd.preferred_skills
        else 0.5
    )

    return round((required_score * 0.8 + preferred_score * 0.2) * 100, 2)


def score_experience_relevance(jd: ParsedJD, candidate: Candidate) -> float:

    role_text = " ".join(candidate.past_roles)

    jd_context = (
        (jd.title or "")
        + " "
        + " ".join(jd.responsibilities)
        + " "
        + (jd.domain or "")
    )

    domain_similarity = semantic_similarity(role_text, jd_context)

    if not jd.min_experience_years:
        years_score = 0.8
    else:
        ratio = candidate.experience_years / jd.min_experience_years

        if ratio <= 1:
            years_score = ratio
        else:
            years_score = min(1.0, 0.85 + 0.05 * (ratio - 1))

    return round((domain_similarity * 0.7 + years_score * 0.3) * 100, 2)


def score_trajectory(candidate: Candidate) -> float:

    if len(candidate.role_progression) <= 1:
        return 40.0

    steps = len(candidate.role_progression) - 1
    velocity = steps / max(candidate.experience_years, 1)

    return round(min(100, 50 + velocity * 60), 2)


def score_behavior(candidate: Candidate) -> float:

    github = candidate.github_activity_score

    certs = min(len(candidate.certifications) * 15, 30)

    hackathons = min(candidate.hackathons * 8, 40)

    learning = candidate.learning_consistency_score

    score = (
        github * 0.35
        + certs
        + hackathons
        + learning * 0.35
    )

    return round(min(score, 100), 2)


def score_potential(
    jd: ParsedJD,
    candidate: Candidate,
    skill_score: float,
    experience_score: float,
):

    current_fit = round(skill_score * 0.6 + experience_score * 0.4, 2)

    growth = score_trajectory(candidate)

    raw = (
        candidate.learning_consistency_score * 0.30
        + candidate.github_activity_score * 0.25
        + min(candidate.hackathons * 10, 100) * 0.20
        + growth * 0.25
    )

    penalty = max(0.0, 1 - candidate.experience_years / 10)

    boost = raw * penalty * 0.30

    future_fit = round(min(100, current_fit * 0.5 + raw * 0.5 + boost), 2)

    potential = round(min(100, raw + boost), 2)

    return {
        "current_fit": current_fit,
        "future_fit": future_fit,
        "potential_score": potential,
    }


def generate_explanation(
    jd: ParsedJD,
    candidate: Candidate,
    scores: dict,
) -> Explanation:

    recommendation = "Interview Further"

    if scores["final_score"] >= 85:
        recommendation = "Strong Hire"
    elif scores["final_score"] >= 75:
        recommendation = "Hire"
    elif scores["final_score"] >= 60:
        recommendation = "Interview Further"
    else:
        recommendation = "Pass"

    return Explanation(
        dimension_explanations=DimensionExplanations(
            skill_match=f"Semantic skill match score: {scores['skill_score']:.1f}/100.",
            experience_relevance=f"Experience relevance score: {scores['experience_score']:.1f}/100.",
            career_trajectory=f"Career trajectory score: {scores['trajectory_score']:.1f}/100.",
            behavioral_signals=f"Behavioral signal score: {scores['behavior_score']:.1f}/100.",
            hidden_potential=f"Hidden potential score: {scores['potential_score']:.1f}/100.",
        ),
        overall_summary=(
            f"{candidate.name} achieved an overall score of "
            f"{scores['final_score']:.1f}/100."
        ),
        standout_strengths=[
            "Strong technical alignment"
            if scores["skill_score"] > 70
            else "Good growth potential"
        ],
        key_risks=[
            "Limited domain experience"
            if scores["experience_score"] < 50
            else "No significant concerns"
        ],
        recommendation=recommendation,
    )


def score_candidate(
    jd: ParsedJD,
    candidate: Candidate,
) -> CandidateScore:

    skill = score_skill_match(jd, candidate)

    experience = score_experience_relevance(jd, candidate)

    trajectory = score_trajectory(candidate)

    behavior = score_behavior(candidate)

    potential = score_potential(
        jd,
        candidate,
        skill,
        experience,
    )

    final_score = round(
        skill * 0.30
        + experience * 0.25
        + trajectory * 0.15
        + behavior * 0.15
        + potential["potential_score"] * 0.15,
        2,
    )

    scores = {
        "skill_score": skill,
        "experience_score": experience,
        "trajectory_score": trajectory,
        "behavior_score": behavior,
        "potential_score": potential["potential_score"],
        "current_fit": potential["current_fit"],
        "future_fit": potential["future_fit"],
        "final_score": final_score,
    }

    return CandidateScore(
        candidate_id=candidate.candidate_id,
        name=candidate.name,
        skill_score=skill,
        experience_score=experience,
        trajectory_score=trajectory,
        behavior_score=behavior,
        potential_score=potential["potential_score"],
        final_score=final_score,
        current_fit=potential["current_fit"],
        future_fit=potential["future_fit"],
        explanation=generate_explanation(
            jd,
            candidate,
            scores,
        ),
    )


def rank_candidates(
    jd: ParsedJD,
    candidates: list[Candidate],
) -> list[CandidateScore]:

    results = [score_candidate(jd, c) for c in candidates]

    results.sort(
        key=lambda x: x.final_score,
        reverse=True,
    )

    return results