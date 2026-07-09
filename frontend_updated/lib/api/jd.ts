import { apiClient } from "./client";
import type { JDInput, ParsedJD } from "@/lib/types";

/** POST /jd/parse-jd — mirrors jd_routes.py exactly. Backend rejects <20 chars. */
export async function parseJobDescription(jdText: string): Promise<ParsedJD> {
  const payload: JDInput = { jd_text: jdText };
  const { data } = await apiClient.post<ParsedJD>("/jd/parse-jd", payload);
  return data;
}
