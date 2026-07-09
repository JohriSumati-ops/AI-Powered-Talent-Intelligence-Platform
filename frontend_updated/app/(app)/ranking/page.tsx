"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Sparkles,
  Database,
  Users2,
  X,
  ArrowUpDown,
  FileWarning,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/domain/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/domain/empty-state";
import { AIThinking } from "@/components/domain/ai-thinking";
import { CandidateCard } from "@/components/domain/candidate-card";
import { UploadDropzone } from "@/components/domain/upload-dropzone";
import { ManualCandidateDialog } from "@/components/domain/manual-candidate-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useRankCandidates } from "@/lib/hooks/use-api";
import { useSessionStore } from "@/lib/store/session-store";
import { DEMO_CANDIDATES } from "@/lib/data/demo-candidates";
import { parseCandidatesFromJSON, CandidateParseError } from "@/lib/utils/candidate-parser";
import { ApiError } from "@/lib/api/client";

export default function RankingPage() {
  const {
    parsedJD,
    candidates,
    candidateSource,
    rankings,
    setCandidates,
    addCandidate,
    setRankings,
  } = useSessionStore();

  const { mutate: runRanking, isPending } = useRankCandidates();
  const [sortBy, setSortBy] = useState<"final_score" | "future_fit">("final_score");

  function handleFile(text: string) {
    try {
      const parsed = parseCandidatesFromJSON(text);
      setCandidates(parsed, "upload");
      toast.success(`Loaded ${parsed.length} candidates from file.`);
    } catch (err) {
      const message = err instanceof CandidateParseError ? err.message : "Could not read that file.";
      toast.error(message);
    }
  }

  function handleLoadDemo() {
    setCandidates(DEMO_CANDIDATES, "demo");
    toast.success(`Loaded ${DEMO_CANDIDATES.length} demo candidates.`);
  }

  function handleRunRanking() {
    if (!parsedJD) {
      toast.error("Parse a job description first.");
      return;
    }
    if (candidates.length === 0) {
      toast.error("Load a candidate pool first.");
      return;
    }
    runRanking(
      { parsedJd: parsedJD, candidates },
      {
        onSuccess: (data) => {
          setRankings(data);
          toast.success(`Ranked ${data.length} candidates.`);
        },
        onError: (err) => {
          toast.error(err instanceof ApiError ? err.detail : "Ranking failed.");
        },
      }
    );
  }

  const sortedRankings = [...rankings].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div>
      <PageHeader
        eyebrow="Candidate Ranking"
        title="Score and rank candidates with AI"
        description="Load a candidate pool and the engine scores skills, experience, trajectory, and behavior to produce a fully explained shortlist."
      />

      {!parsedJD && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-amber/20 bg-amber-muted px-4 py-3 text-sm">
          <span>You haven&apos;t parsed a job description yet — ranking needs one to score against.</span>
          <Button asChild size="sm" variant="secondary">
            <Link href="/jd-parser">Parse a JD</Link>
          </Button>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <Database className="size-4" />
            1. Load candidates
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <UploadDropzone onFileText={handleFile} />

          <div className="flex flex-wrap items-center gap-2">
            <ManualCandidateDialog onAdd={(c) => addCandidate(c)} />
            <Button variant="secondary" size="sm" onClick={handleLoadDemo}>
              <Sparkles className="size-4" />
              Load demo dataset
            </Button>
            {candidates.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCandidates([], null)}
                className="ml-auto text-muted-foreground"
              >
                <X className="size-4" />
                Clear pool
              </Button>
            )}
          </div>

          {candidates.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
              <Users2 className="size-4 text-muted-foreground" />
              <span>
                <strong>{candidates.length}</strong> candidates loaded
              </span>
              {candidateSource && <Badge tone="outline">{candidateSource}</Badge>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-5">
          <Button
            className="w-full"
            size="lg"
            onClick={handleRunRanking}
            disabled={isPending || !parsedJD || candidates.length === 0}
          >
            <Sparkles className="size-4" />
            {isPending ? "Running AI Ranking..." : "Run AI Ranking"}
          </Button>
          {isPending && (
            <div className="mt-3">
              <AIThinking label={`Scoring ${candidates.length} candidates across 5 dimensions`} />
            </div>
          )}
        </CardContent>
      </Card>

      {isPending && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-16 w-full" />
            </Card>
          ))}
        </div>
      )}

      {!isPending && rankings.length === 0 && (
        <EmptyState
          icon={FileWarning}
          title="No ranking results yet"
          description="Load candidates, make sure a JD is parsed, then run AI ranking to see explained results here."
        />
      )}

      {!isPending && rankings.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg">
              {rankings.length} ranked candidates
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setSortBy((s) => (s === "final_score" ? "future_fit" : "final_score"))
              }
            >
              <ArrowUpDown className="size-4" />
              Sort by {sortBy === "final_score" ? "Overall Score" : "Future Fit"}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {sortedRankings.map((score, i) => (
              <CandidateCard key={score.candidate_id} score={score} rank={i + 1} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild variant="secondary">
              <Link href="/compare">
                Compare two candidates
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
