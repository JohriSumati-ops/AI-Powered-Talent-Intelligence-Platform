import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Candidate, CandidateScore, ParsedJD } from "@/lib/types";

export type CandidateSourceType = "upload" | "manual" | "demo" | null;

interface SessionState {
  parsedJD: ParsedJD | null;
  candidates: Candidate[];
  candidateSource: CandidateSourceType;
  rankings: CandidateScore[];
  lastRankedAt: string | null;

  setParsedJD: (jd: ParsedJD | null) => void;
  setCandidates: (candidates: Candidate[], source: CandidateSourceType) => void;
  addCandidate: (candidate: Candidate) => void;
  setRankings: (rankings: CandidateScore[]) => void;
  clearSession: () => void;
  getCandidateById: (id: string) => Candidate | undefined;
  getScoreById: (id: string) => CandidateScore | undefined;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      parsedJD: null,
      candidates: [],
      candidateSource: null,
      rankings: [],
      lastRankedAt: null,

      setParsedJD: (jd) => set({ parsedJD: jd }),

      setCandidates: (candidates, source) =>
        set({ candidates, candidateSource: source, rankings: [] }),

      addCandidate: (candidate) =>
        set((state) => ({
          candidates: [...state.candidates, candidate],
          candidateSource: state.candidateSource ?? "manual",
        })),

      setRankings: (rankings) =>
        set({ rankings, lastRankedAt: new Date().toISOString() }),

      clearSession: () =>
        set({
          parsedJD: null,
          candidates: [],
          candidateSource: null,
          rankings: [],
          lastRankedAt: null,
        }),

      getCandidateById: (id) =>
        get().candidates.find((c) => c.candidate_id === id),

      getScoreById: (id) =>
        get().rankings.find((r) => r.candidate_id === id),
    }),
    {
      name: "tie-session-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
