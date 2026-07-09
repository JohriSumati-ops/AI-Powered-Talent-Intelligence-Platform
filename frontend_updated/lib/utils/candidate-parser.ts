import type { Candidate } from "@/lib/types";

export class CandidateParseError extends Error {}

/**
 * Accepts either:
 *  - a raw JSON array of Candidate objects
 *  - an object with a top-level `candidates` array
 * Validates each entry against the exact fields the backend's Candidate
 * model requires (src/models/candidate_models.py). Does NOT invent or
 * relax fields — malformed entries are rejected with a clear message
 * rather than silently coerced, since the backend will 422 on bad shape.
 */
export function parseCandidatesFromJSON(raw: string): Candidate[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new CandidateParseError("That file isn't valid JSON.");
  }

  const list: unknown[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { candidates?: unknown[] })?.candidates)
      ? (parsed as { candidates: unknown[] }).candidates
      : [];

  if (list.length === 0) {
    throw new CandidateParseError(
      "No candidates found. Provide a JSON array, or an object with a top-level `candidates` array."
    );
  }

  return list.map((entry, index) => normalizeCandidate(entry, index));
}

const REQUIRED_STRING_FIELDS = ["candidate_id", "name", "title", "bio"] as const;
const REQUIRED_STRING_ARRAY_FIELDS = [
  "skills",
  "past_roles",
  "role_progression",
  "certifications",
] as const;

function normalizeCandidate(entry: unknown, index: number): Candidate {
  if (typeof entry !== "object" || entry === null) {
    throw new CandidateParseError(`Candidate at position ${index + 1} isn't an object.`);
  }

  const c = entry as Record<string, unknown>;

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof c[field] !== "string" || (c[field] as string).trim() === "") {
      throw new CandidateParseError(
        `Candidate at position ${index + 1} is missing "${field}".`
      );
    }
  }

  for (const field of REQUIRED_STRING_ARRAY_FIELDS) {
    if (!Array.isArray(c[field])) {
      throw new CandidateParseError(
        `Candidate "${c.name ?? index + 1}" is missing a "${field}" array.`
      );
    }
  }

  const experience_years = Number(c.experience_years);
  const github_activity_score = Number(c.github_activity_score);
  const hackathons = Number(c.hackathons);
  const learning_consistency_score = Number(c.learning_consistency_score);

  if (Number.isNaN(experience_years)) {
    throw new CandidateParseError(
      `Candidate "${c.name}" has a non-numeric "experience_years".`
    );
  }

  return {
    candidate_id: String(c.candidate_id),
    name: String(c.name),
    title: String(c.title),
    skills: (c.skills as unknown[]).map(String),
    experience_years,
    past_roles: (c.past_roles as unknown[]).map(String),
    role_progression: (c.role_progression as unknown[]).map(String),
    github_activity_score: clamp(github_activity_score || 0, 0, 100),
    certifications: (c.certifications as unknown[]).map(String),
    hackathons: Number.isNaN(hackathons) ? 0 : hackathons,
    learning_consistency_score: clamp(learning_consistency_score || 0, 0, 100),
    bio: String(c.bio),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
