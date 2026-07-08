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

IMPORTANT:
- Return ONLY valid JSON.
- Never use markdown.
- Never wrap the JSON in ```json.
- Never return null for list fields.
- Always return [] for empty lists.

Schema:

{
  "title": "string or null",
  "required_skills": ["string"],
  "preferred_skills": ["string"],
  "min_experience_years": number or null,
  "responsibilities": ["string"],
  "seniority": "Junior | Mid | Senior | Staff | Principal | Executive | null",
  "domain": "string or null",
  "team_type": "IC | Lead | Managerial | Cross-functional | Founding | null",
  "culture_signals": ["string"],
  "startup_readiness_required": true,
  "ambiguity_tolerance_required": "Low | Medium | High | null",
  "jd_quality_notes": "string or null"
}
"""


class JDParserService:

    LIST_FIELDS = [
        "required_skills",
        "preferred_skills",
        "responsibilities",
        "culture_signals",
    ]

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

        print("\n" + "=" * 80)
        print("RAW LLM RESPONSE")
        print(raw_response)
        print("=" * 80 + "\n")

        parsed = self._safe_parse(raw_response)

        parsed = self._normalize(parsed)

        print("\n" + "=" * 80)
        print("NORMALIZED PARSED JSON")
        print(json.dumps(parsed, indent=2))
        print("=" * 80 + "\n")

        return ParsedJD(
            raw_text=raw_text,
            **parsed,
        )

    def _normalize(self, parsed: Dict[str, Any]) -> Dict[str, Any]:
        """
        Makes LLM output safe for Pydantic.
        """

        # ---------- List fields ----------
        for field in self.LIST_FIELDS:
            value = parsed.get(field)

            if value is None:
                parsed[field] = []

            elif isinstance(value, str):
                parsed[field] = [value]

            elif not isinstance(value, list):
                parsed[field] = []

        # ---------- Integer ----------
        years = parsed.get("min_experience_years")

        if years is None:
            pass

        elif isinstance(years, float):
            parsed["min_experience_years"] = int(years)

        elif isinstance(years, str):
            digits = "".join(ch for ch in years if ch.isdigit())

            parsed["min_experience_years"] = (
                int(digits)
                if digits
                else None
            )

        # ---------- Boolean ----------
        startup = parsed.get("startup_readiness_required")

        if startup is None:
            parsed["startup_readiness_required"] = False

        elif isinstance(startup, str):
            parsed["startup_readiness_required"] = startup.lower() in (
                "true",
                "yes",
                "1",
            )

        return parsed

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