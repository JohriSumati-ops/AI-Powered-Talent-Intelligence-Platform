/**
 * These types are a 1:1 mirror of the backend's Pydantic models.
 * Source of truth: src/models/*.py in the backend repo.
 * Do NOT add fields here that the backend doesn't return/accept —
 * the backend is frozen and the frontend must adapt to it.
 */

// ---------------------------------------------------------------------------
// jd_models.py
// ---------------------------------------------------------------------------

export type Seniority =
  | "Junior"
  | "Mid"
  | "Senior"
  | "Staff"
  | "Principal"
  | "Executive";

export type TeamType =
  | "IC"
  | "Lead"
  | "Managerial"
  | "Cross-functional"
  | "Founding";

export type AmbiguityTolerance = "Low" | "Medium" | "High";

export interface JDInput {
  jd_text: string;
}

export interface ParsedJD {
  title: string | null;
  required_skills: string[];
  preferred_skills: string[];
  min_experience_years: number | null;
  responsibilities: string[];
  raw_text: string;

  seniority: Seniority | null;
  domain: string | null;
  team_type: TeamType | null;
  culture_signals: string[];
  startup_readiness_required: boolean | null;
  ambiguity_tolerance_required: AmbiguityTolerance | null;
  jd_quality_notes: string | null;
}

// ---------------------------------------------------------------------------
// candidate_models.py
// ---------------------------------------------------------------------------

export interface Candidate {
  candidate_id: string;
  name: string;
  title: string;
  skills: string[];
  experience_years: number;
  past_roles: string[];
  role_progression: string[];
  github_activity_score: number; // 0-100
  certifications: string[];
  hackathons: number;
  learning_consistency_score: number; // 0-100
  bio: string;
}

export type Recommendation =
  | "Strong Hire"
  | "Hire"
  | "Interview Further"
  | "Pass";

export interface DimensionExplanations {
  skill_match: string;
  experience_relevance: string;
  career_trajectory: string;
  behavioral_signals: string;
  hidden_potential: string;
}

export interface Explanation {
  dimension_explanations: DimensionExplanations;
  overall_summary: string;
  standout_strengths: string[];
  key_risks: string[];
  recommendation: Recommendation;
}

export interface CandidateScore {
  candidate_id: string;
  name: string;
  skill_score: number;
  experience_score: number;
  trajectory_score: number;
  behavior_score: number;
  potential_score: number;
  final_score: number;
  current_fit: number;
  future_fit: number;
  explanation: Explanation;
}

export interface RankRequest {
  parsed_jd: ParsedJD;
  candidates: Candidate[];
  query?: string | null;
}

export interface ExplainRequest {
  parsed_jd: ParsedJD;
  candidate: Candidate;
}

export interface QueryRequest {
  parsed_jd: ParsedJD;
  candidates: Candidate[];
  natural_query: string;
}

// ---------------------------------------------------------------------------
// chat_models.py
// ---------------------------------------------------------------------------

export interface ChatRequest {
  parsed_jd: ParsedJD;
  candidates: Candidate[];
  question: string;
}

export interface ChatResponse {
  answer: string;
}

// ---------------------------------------------------------------------------
// comparison_models.py
// ---------------------------------------------------------------------------

export interface CompareRequest {
  parsed_jd: ParsedJD;
  candidate_a: Candidate;
  candidate_b: Candidate;
}

export type ComparisonWinner = "Candidate A" | "Candidate B" | "Tie";

export interface CompareResponse {
  winner: string;
  comparison: {
    skill: ComparisonWinner;
    experience: ComparisonWinner;
    trajectory: ComparisonWinner;
    behavior: ComparisonWinner;
    potential: ComparisonWinner;
    overall: ComparisonWinner;
  };
  reason: string;
}

// ---------------------------------------------------------------------------
// retrieval_models.py
// ---------------------------------------------------------------------------

export interface CandidateEmbeddingRecord {
  candidate_id: string;
  name?: string | null;
  resume_text: string;
}

export interface RetrieveRequest {
  job_description: string;
  top_k: number;
  candidates?: CandidateEmbeddingRecord[] | null;
}

export interface RetrievedCandidate {
  candidate_id: string;
  name?: string | null;
  similarity_score: number;
  rank: number;
}

export interface RetrieveResponse {
  query_preview: string;
  total_candidates_searched: number;
  top_k: number;
  results: RetrievedCandidate[];
}

// ---------------------------------------------------------------------------
// Frontend-only helper types (not part of the backend contract)
// ---------------------------------------------------------------------------

export interface ApiErrorShape {
  detail: string;
}
