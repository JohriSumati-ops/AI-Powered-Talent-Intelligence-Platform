import { apiClient } from "./client";
import type {
  CandidateEmbeddingRecord,
  RetrieveResponse,
} from "@/lib/types";

/**
 * POST /retrieval/retrieve — mirrors retrieval_routes.py.
 * If `candidates` is omitted the backend searches its persisted FAISS index;
 * if supplied, it builds a throwaway index from exactly those candidates.
 */
export async function retrieveCandidates(params: {
  jobDescription: string;
  topK: number;
  candidates?: CandidateEmbeddingRecord[];
}): Promise<RetrieveResponse> {
  const { data } = await apiClient.post<RetrieveResponse>(
    "/retrieval/retrieve",
    {
      job_description: params.jobDescription,
      top_k: params.topK,
      candidates: params.candidates ?? null,
    }
  );
  return data;
}
