import { apiClient } from "./client";
import type { Candidate, CompareResponse, ParsedJD } from "@/lib/types";

/** POST /compare — mirrors comparison_routes.py exactly. */
export async function compareCandidates(
  parsedJd: ParsedJD,
  candidateA: Candidate,
  candidateB: Candidate
): Promise<CompareResponse> {
  const { data } = await apiClient.post<CompareResponse>("/compare", {
    parsed_jd: parsedJd,
    candidate_a: candidateA,
    candidate_b: candidateB,
  });
  return data;
}
