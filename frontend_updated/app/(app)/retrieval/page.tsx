"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ScanSearch, Search, Users2, Hash } from "lucide-react";
import { PageHeader } from "@/components/domain/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/domain/empty-state";
import { AIThinking } from "@/components/domain/ai-thinking";
import { initials } from "@/lib/utils/scoring";
import { useRetrieveCandidates } from "@/lib/hooks/use-api";
import { useSessionStore } from "@/lib/store/session-store";
import { ApiError } from "@/lib/api/client";

const SAMPLE_QUERIES = [
  "Strong backend engineers with AI exposure",
  "Candidates with leadership potential",
  "Top profiles with strong future growth",
];

export default function RetrievalPage() {
  const { candidates } = useSessionStore();
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(10);
  const { mutate, data: result, isPending } = useRetrieveCandidates();

  function handleSearch() {
    if (query.trim().length < 5) {
      toast.error("Describe what you're looking for in a bit more detail.");
      return;
    }

    mutate(
      {
        jobDescription: query,
        topK,
        candidates:
          candidates.length > 0
            ? candidates.map((c) => ({
                candidate_id: c.candidate_id,
                name: c.name,
                resume_text: [
                  c.title,
                  c.bio,
                  c.skills.join(", "),
                  c.past_roles.join(", "),
                ].join(". "),
              }))
            : undefined,
      },
      {
        onError: (err) =>
          toast.error(err instanceof ApiError ? err.detail : "Retrieval failed."),
      }
    );
  }

  const candidateById = new Map(candidates.map((c) => [c.candidate_id, c]));

  return (
    <div>
      <PageHeader
        eyebrow="Semantic Retrieval"
        title="Search your candidate pool in plain English"
        description="FAISS-backed semantic search that goes beyond keyword filters — describe who you're looking for, not just what tags to match."
      />

      {candidates.length === 0 && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-amber/20 bg-amber-muted px-4 py-3 text-sm">
          <span>No candidate pool loaded — this will search the backend&apos;s persisted index instead of your session candidates.</span>
          <Button asChild size="sm" variant="secondary">
            <Link href="/ranking">Load candidates</Link>
          </Button>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <ScanSearch className="size-4" />
            Describe who you&apos;re looking for
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <Textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Strong backend engineers with AI exposure and a track record of shipping fast"
          />
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="size-3.5" />
              Top K
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value) || 10)}
              className="w-20"
            />
            <Button className="ml-auto" onClick={handleSearch} disabled={isPending}>
              <Search className="size-4" />
              {isPending ? "Searching..." : "Search"}
            </Button>
          </div>
          {isPending && <AIThinking label="Embedding query and searching the vector index" />}
        </CardContent>
      </Card>

      {!isPending && !result && (
        <EmptyState
          icon={ScanSearch}
          title="No search yet"
          description="Describe a candidate profile above to see semantically ranked matches."
        />
      )}

      {!isPending && result && (
        <div className="animate-fade-in">
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users2 className="size-4" />
              Searched {result.total_candidates_searched} candidates · showing top {result.results.length}
            </span>
          </div>

          {result.results.length === 0 ? (
            <EmptyState
              icon={ScanSearch}
              title="No matches found"
              description="The persisted index may be empty. Load a candidate pool or try a different query."
            />
          ) : (
            <div className="space-y-3">
              {result.results.map((r) => {
                const candidate = candidateById.get(r.candidate_id);
                return (
                  <Card key={r.candidate_id} className="p-4 flex items-center gap-4">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary-muted text-xs font-medium text-primary shrink-0">
                      {r.rank}
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-medium shrink-0">
                      {initials(r.name || candidate?.name || "?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {r.name || candidate?.name || r.candidate_id}
                      </p>
                      {candidate && (
                        <p className="text-xs text-muted-foreground truncate">{candidate.title}</p>
                      )}
                    </div>
                    <div className="w-40 hidden sm:block">
                      <Progress value={r.similarity_score * 100} tone="primary" />
                    </div>
                    <Badge tone="primary" className="shrink-0">
                      {(r.similarity_score * 100).toFixed(1)}%
                    </Badge>
                    {candidate && (
                      <Button asChild size="sm" variant="ghost" className="shrink-0">
                        <Link href={`/ranking/${candidate.candidate_id}`}>View</Link>
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
