import { apiClient } from "./client";
import type { Candidate, ChatResponse, ParsedJD } from "@/lib/types";

/** POST /chat — mirrors chat_routes.py. Stateless: full JD + candidate pool sent every turn. */
export async function askRecruiterAI(
  parsedJd: ParsedJD,
  candidates: Candidate[],
  question: string
): Promise<ChatResponse> {
  const { data } = await apiClient.post<ChatResponse>("/chat", {
    parsed_jd: parsedJd,
    candidates,
    question,
  });
  return data;
}
