"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Users2, Trophy, GitCompareArrows, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/domain/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/domain/empty-state";
import { AIThinking } from "@/components/domain/ai-thinking";
import { initials } from "@/lib/utils/scoring";
import { useCompareCandidates } from "@/lib/hooks/use-api";
import { useSessionStore } from "@/lib/store/session-store";
import { ApiError } from "@/lib/api/client";
import type { ComparisonWinner } from "@/lib/types";

const METRIC_LABELS: { key: keyof CompareComparisonDict; label: string }[] = [
  { key: "skill", label: "Skill Match" },
  { key: "experience", label: "Experience" },
  { key: "trajectory", label: "Career Trajectory" },
  { key: "behavior", label: "Behavioral Signals" },
  { key: "potential", label: "Hidden Potential" },
  { key: "overall", label: "Overall" },
];

type CompareComparisonDict = {
  skill: ComparisonWinner;
  experience: ComparisonWinner;
  trajectory: ComparisonWinner;
  behavior: ComparisonWinner;
  potential: ComparisonWinner;
  overall: ComparisonWinner;
};

export default function ComparePage() {
  const { parsedJD, candidates } = useSessionStore();
  const [idA, setIdA] = useState<string>("");
  const [idB, setIdB] = useState<string>("");
  const { mutate, data: result, isPending, reset } = useCompareCandidates();

  const candidateA = candidates.find((c) => c.candidate_id === idA);
  const candidateB = candidates.find((c) => c.candidate_id === idB);

  function handleCompare() {
    if (!parsedJD) {
      toast.error("Parse a job description first.");
      return;
    }
    if (!candidateA || !candidateB) {
      toast.error("Select two candidates to compare.");
      return;
    }
    if (idA === idB) {
      toast.error("Select two different candidates.");
      return;
    }
    mutate(
      { parsedJd: parsedJD, candidateA, candidateB },
      {
        onError: (err) => toast.error(err instanceof ApiError ? err.detail : "Comparison failed."),
      }
    );
  }

  if (candidates.length < 2 || !parsedJD) {
    return (
      <div>
        <PageHeader
          eyebrow="Candidate Comparison"
          title="Compare two candidates head-to-head"
          description="See how two candidates stack up across skill, experience, trajectory, behavior, and potential."
        />
        <EmptyState
          icon={Users2}
          title={!parsedJD ? "Parse a job description first" : "Need at least two candidates"}
          description={
            !parsedJD
              ? "Comparison scores candidates against a parsed job description."
              : "Load at least two candidates in Candidate Ranking to compare them."
          }
          action={
            <Button asChild size="sm" variant="secondary">
              <Link href={!parsedJD ? "/jd-parser" : "/ranking"}>
                {!parsedJD ? "Parse a JD" : "Load candidates"}
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Candidate Comparison"
        title="Compare two candidates head-to-head"
        description="See how two candidates stack up across skill, experience, trajectory, behavior, and potential."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <GitCompareArrows className="size-4" />
            Select candidates
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid gap-4 sm:grid-cols-2">
          <CandidateSelect
            label="Candidate A"
            value={idA}
            onChange={(v) => {
              setIdA(v);
              reset();
            }}
            options={candidates}
            exclude={idB}
          />
          <CandidateSelect
            label="Candidate B"
            value={idB}
            onChange={(v) => {
              setIdB(v);
              reset();
            }}
            options={candidates}
            exclude={idA}
          />
        </CardContent>
        <CardContent className="pt-0">
          <Button className="w-full" onClick={handleCompare} disabled={isPending}>
            <GitCompareArrows className="size-4" />
            {isPending ? "Comparing..." : "Compare Candidates"}
          </Button>
          {isPending && (
            <div className="mt-3">
              <AIThinking label="Weighing scores across every dimension" />
            </div>
          )}
        </CardContent>
      </Card>

      {result && candidateA && candidateB && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 flex items-center justify-center gap-3 bg-primary-muted/40 border-primary/20">
            <Trophy className="size-5 text-primary" />
            <p className="font-display text-lg font-semibold">
              {result.winner} ranked higher overall
            </p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dimension-by-dimension</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground pb-2 border-b border-border mb-2">
                <span>{candidateA.name}</span>
                <span className="text-center">Metric</span>
                <span className="text-right">{candidateB.name}</span>
              </div>
              {METRIC_LABELS.map((metric) => {
                const winner = result.comparison[metric.key];
                return (
                  <div
                    key={metric.key}
                    className="grid grid-cols-3 items-center gap-2 py-2.5 border-b border-border last:border-0 text-sm"
                  >
                    <div>
                      {winner === "Candidate A" && <WinnerBadge />}
                    </div>
                    <span className="text-center text-muted-foreground text-xs">
                      {metric.label}
                    </span>
                    <div className="flex justify-end">
                      {winner === "Candidate B" && <WinnerBadge />}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reasoning</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
                {result.reason}
              </pre>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button asChild variant="secondary">
              <Link href="/chat">
                Ask the Recruiter AI about this
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function WinnerBadge() {
  return (
    <Badge tone="emerald">
      <Trophy className="size-3" />
      Winner
    </Badge>
  );
}

function CandidateSelect({
  label,
  value,
  onChange,
  options,
  exclude,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { candidate_id: string; name: string; title: string }[];
  exclude?: string;
}) {
  const selected = options.find((o) => o.candidate_id === value);
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <option value="">Select a candidate...</option>
        {options
          .filter((o) => o.candidate_id !== exclude)
          .map((o) => (
            <option key={o.candidate_id} value={o.candidate_id}>
              {o.name} — {o.title}
            </option>
          ))}
      </select>
      {selected && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary-muted text-xs font-medium text-primary">
            {initials(selected.name)}
          </div>
          <span className="text-muted-foreground">{selected.title}</span>
        </div>
      )}
    </div>
  );
}
