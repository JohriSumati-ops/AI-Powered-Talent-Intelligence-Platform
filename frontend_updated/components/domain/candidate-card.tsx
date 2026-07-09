"use client";

import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/domain/score-ring";
import { RecommendationBadge } from "@/components/domain/recommendation-badge";
import { initials } from "@/lib/utils/scoring";
import type { CandidateScore } from "@/lib/types";

export function CandidateCard({
  score,
  rank,
}: {
  score: CandidateScore;
  rank: number;
}) {
  return (
    <Link href={`/ranking/${score.candidate_id}`}>
      <Card hover className="p-5 h-full flex flex-col gap-4 group">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-muted text-sm font-medium text-primary">
              {initials(score.name)}
            </div>
            <div>
              <p className="font-medium leading-tight">{score.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <BriefcaseBusiness className="size-3" />
                Rank #{rank}
              </p>
            </div>
          </div>
          <ScoreRing score={score.final_score} size={56} strokeWidth={5} />
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {score.explanation.overall_summary}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-3 border-t border-border">
          <RecommendationBadge recommendation={score.explanation.recommendation} />
          <Badge tone="outline">Fit now {score.current_fit.toFixed(0)}</Badge>
          <Badge tone="outline">Fit future {score.future_fit.toFixed(0)}</Badge>
          <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Card>
    </Link>
  );
}
