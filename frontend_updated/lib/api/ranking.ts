import { apiClient } from "./client";
import type { Candidate, CandidateScore, ParsedJD } from "@/lib/types";

/** POST /ranking/rank — mirrors ranking_routes.py. Backend rejects an empty candidate list. */
export async function rankCandidates(
  parsedJd: ParsedJD,
  candidates: Candidate[]
): Promise<CandidateScore[]> {
  const { data } = await apiClient.post<CandidateScore[]>("/ranking/rank", {
    parsed_jd: parsedJd,
    candidates,
  });
  return data;
}
