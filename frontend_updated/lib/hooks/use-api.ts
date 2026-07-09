"use client";

import { useMutation } from "@tanstack/react-query";
import { parseJobDescription } from "@/lib/api/jd";
import { rankCandidates } from "@/lib/api/ranking";
import { askRecruiterAI } from "@/lib/api/chat";
import { compareCandidates } from "@/lib/api/compare";
import { retrieveCandidates } from "@/lib/api/retrieval";
import type { Candidate, ParsedJD } from "@/lib/types";

export function useParseJD() {
  return useMutation({
    mutationFn: (jdText: string) => parseJobDescription(jdText),
  });
}

export function useRankCandidates() {
  return useMutation({
    mutationFn: ({
      parsedJd,
      candidates,
    }: {
      parsedJd: ParsedJD;
      candidates: Candidate[];
    }) => rankCandidates(parsedJd, candidates),
  });
}

export function useRecruiterChat() {
  return useMutation({
    mutationFn: ({
      parsedJd,
      candidates,
      question,
    }: {
      parsedJd: ParsedJD;
      candidates: Candidate[];
      question: string;
    }) => askRecruiterAI(parsedJd, candidates, question),
  });
}

export function useCompareCandidates() {
  return useMutation({
    mutationFn: ({
      parsedJd,
      candidateA,
      candidateB,
    }: {
      parsedJd: ParsedJD;
      candidateA: Candidate;
      candidateB: Candidate;
    }) => compareCandidates(parsedJd, candidateA, candidateB),
  });
}

export function useRetrieveCandidates() {
  return useMutation({
    mutationFn: retrieveCandidates,
  });
}
