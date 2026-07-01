import json
from typing import Dict, Any

from src.models.jd_models import ParsedJD
from src.utils.llm_client import chat_completion
from src.utils.logger import get_logger

logger = get_logger(__name__)

_SYSTEM_PROMPT = """You are a senior technical recruiter and org-design expert who has parsed thousands of job descriptions across startups and enterprises. You extract structured signal from raw JD text with a level of nuance that generic NLP extraction misses.

Extract the following from the JD:

CORE FIELDS:
- title
- required_skills (explicit must-haves only)
- preferred_skills (nice-to-haves, "bonus", "plus")
- min_experience_years (integer, infer from phrasing like "5+ years")
- responsibilities (list of core duties)

ADVANCED SIGNALS:
- seniority: one of Junior, Mid, Senior, Staff, Principal, Executive
- domain: the industry/product domain
- team_type: one of IC, Lead, Managerial, Cross-functional, Founding
- culture_signals: list of 2-5 short phrases
- startup_readiness_required: true if ambiguity/startup mindset is implied
- ambiguity_tolerance_required: Low, Medium, or High
- jd_quality_notes: 1-2 sentence assessment of the JD quality

Respond ONLY with valid JSON matching exactly this schema:

{
  "title": "string or null",
  "required_skills": ["string"],
  "preferred_skills": ["string"],
  "min_experience_years": number or null,
  "responsibilities": ["string"],
  "seniority": "string or null",
  "domain": "string or null",
  "team_type": "string or null",
  "culture_signals": ["string"],
  "startup_readiness_required": true,
  "ambiguity_tolerance_required": "string or null",
  "jd_quality_notes": "string or null"
}
"""


class JDParserService:
    def parse(self, raw_text: str) -> ParsedJD:
        raw_response = chat_completion(
            messages=[
                {
                    "role": "system",
                    "content": _SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": f"JOB DESCRIPTION:\n\n{raw_text}",
                },
            ],
            temperature=0.2,
        )

        parsed = self._safe_parse(raw_response)
        return ParsedJD(raw_text=raw_text, **parsed)

    @staticmethod
    def _safe_parse(raw_response: str) -> Dict[str, Any]:
        cleaned = raw_response.strip()

        if cleaned.startswith("```"):
            lines = cleaned.splitlines()

            if lines and lines[0].startswith("```"):
                lines = lines[1:]

            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]

            cleaned = "\n".join(lines).strip()

            if cleaned.lower().startswith("json"):
                cleaned = cleaned[4:].strip()

        try:
            return json.loads(cleaned)

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM output: {e}")
            logger.error(f"Raw response:\n{raw_response}")
            raise ValueError("LLM returned malformed JSON.")


def parse_job_description(raw_text: str) -> ParsedJD:
    """
    Convenience function used by API routes.
    """
    service = JDParserService()
    return service.parse(raw_text)