import json

from src.models.jd_models import ParsedJD
from src.models.candidate_models import Candidate
from src.services.ranking_service import rank_candidates
from src.utils.llm_client import chat_completion


_SYSTEM_PROMPT = """
You are an expert AI Recruiting Copilot.

You are helping recruiters make hiring decisions.

You receive:

1. The parsed Job Description
2. Ranked candidates
3. The recruiter's question

Always answer professionally.

When comparing candidates:
- explain WHY
- reference skills
- reference experience
- reference potential
- mention risks

Never invent candidates.

Use only the provided information.
"""


def recruiter_chat(
    parsed_jd: ParsedJD,
    candidates: list[Candidate],
    question: str,
) -> str:

    ranked = rank_candidates(parsed_jd, candidates)

    ranking_data = []

    for score in ranked:
        ranking_data.append(
            {
                "name": score.name,
                "overall_score": score.final_score,
                "skill_score": score.skill_score,
                "experience_score": score.experience_score,
                "trajectory_score": score.trajectory_score,
                "behavior_score": score.behavior_score,
                "potential_score": score.potential_score,
                "current_fit": score.current_fit,
                "future_fit": score.future_fit,
            }
        )

    user_prompt = f"""
JOB DESCRIPTION

{parsed_jd.model_dump_json(indent=2)}

------------------------------------

RANKED CANDIDATES

{json.dumps(ranking_data, indent=2)}

------------------------------------

Recruiter Question:

{question}
"""

    return chat_completion(
        messages=[
            {
                "role": "system",
                "content": _SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        temperature=0.3,
    )