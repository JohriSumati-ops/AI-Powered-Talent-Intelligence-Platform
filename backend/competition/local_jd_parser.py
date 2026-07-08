import re

from src.models.jd_models import ParsedJD

COMMON_SKILLS = [
    "python",
    "java",
    "c++",
    "javascript",
    "typescript",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "git",
    "linux",
    "react",
    "angular",
    "vue",
    "node",
    "fastapi",
    "django",
    "flask",
    "tensorflow",
    "pytorch",
    "machine learning",
    "deep learning",
    "nlp",
    "llm",
    "retrieval",
    "ranking",
    "faiss",
    "milvus",
    "pinecone",
    "weaviate",
]


def parse_job_description(jd_text: str) -> ParsedJD:
    """
    Lightweight local parser used for competition submission.
    Accepts raw JD text (NOT a filename).
    """

    jd_lower = jd_text.lower()

    skills = [
        skill
        for skill in COMMON_SKILLS
        if skill in jd_lower
    ]

    exp_match = re.search(
        r"(\d+)\+?\s*(?:years|year)",
        jd_lower,
    )

    experience = (
        int(exp_match.group(1))
        if exp_match
        else 0
    )

    title = None

    first_line = jd_text.splitlines()[0].strip()

    if first_line:
        title = first_line

    return ParsedJD(
        raw_text=jd_text,
        title=title,
        required_skills=skills,
        preferred_skills=[],
        min_experience_years=experience,
        responsibilities=[],
        seniority=None,
        domain=None,
        team_type=None,
        culture_signals=[],
        startup_readiness_required=None,
        ambiguity_tolerance_required=None,
        jd_quality_notes="Parsed locally for competition submission.",
    )