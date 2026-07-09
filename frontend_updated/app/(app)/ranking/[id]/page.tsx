"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Briefcase,
  GraduationCap,
  Code2,
  Github,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/domain/page-header";
import { ScoreRing } from "@/components/domain/score-ring";
import { DimensionBars } from "@/components/domain/dimension-bars";
import { RecommendationBadge } from "@/components/domain/recommendation-badge";
import { EmptyState } from "@/components/domain/empty-state";
import { useSessionStore } from "@/lib/store/session-store";
import { initials } from "@/lib/utils/scoring";

export default function CandidateAnalysisPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getCandidateById, getScoreById } = useSessionStore();

  const score = getScoreById(params.id);
  const candidate = getCandidateById(params.id);

  if (!score) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="No ranking found for this candidate"
        description="This candidate isn't part of your current session's ranking results. Run a ranking first."
        action={
          <Button asChild variant="secondary" size="sm">
            <Link href="/ranking">Back to ranking</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/ranking")}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Back to ranking
      </button>

      <PageHeader
        eyebrow="Candidate Analysis"
        title={score.name}
        description={candidate?.title ?? "Detailed explainability for this candidate's ranking result."}
        actions={<RecommendationBadge recommendation={score.explanation.recommendation} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary-muted text-lg font-medium text-primary mb-4">
              {initials(score.name)}
            </div>
            <ScoreRing score={score.final_score} size={110} strokeWidth={8} label="overall" />
            <div className="mt-4 grid grid-cols-2 gap-3 w-full">
              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Current Fit</p>
                <p className="font-display text-lg font-semibold">{score.current_fit.toFixed(1)}</p>
              </div>
              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Future Fit</p>
                <p className="font-display text-lg font-semibold">{score.future_fit.toFixed(1)}</p>
              </div>
            </div>
          </Card>

          {candidate && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <Briefcase className="size-4" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-sm">
                <p className="text-muted-foreground">{candidate.bio}</p>

                <InfoRow icon={Code2} label="Skills">
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {candidate.skills.map((s) => (
                      <Badge key={s} tone="outline">{s}</Badge>
                    ))}
                  </div>
                </InfoRow>

                <InfoRow icon={Briefcase} label={`${candidate.experience_years} years experience`}>
                  <p className="text-xs text-muted-foreground mt-1">
                    {candidate.role_progression.join(" → ")}
                  </p>
                </InfoRow>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <MiniStat icon={Github} value={candidate.github_activity_score} label="GitHub" />
                  <MiniStat icon={Trophy} value={candidate.hackathons} label="Hackathons" />
                  <MiniStat icon={GraduationCap} value={candidate.certifications.length} label="Certs" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Sparkles className="size-4" />
                Scoring Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <DimensionBars score={score} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Explanation</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm">
              <p>{score.explanation.overall_summary}</p>

              <DimensionExplanation label="Skill Match" text={score.explanation.dimension_explanations.skill_match} />
              <DimensionExplanation label="Experience Relevance" text={score.explanation.dimension_explanations.experience_relevance} />
              <DimensionExplanation label="Career Trajectory" text={score.explanation.dimension_explanations.career_trajectory} />
              <DimensionExplanation label="Behavioral Signals" text={score.explanation.dimension_explanations.behavioral_signals} />
              <DimensionExplanation label="Hidden Potential" text={score.explanation.dimension_explanations.hidden_potential} />
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="flex items-center gap-1.5 text-sm font-medium text-emerald mb-3">
                <CheckCircle2 className="size-4" />
                Standout Strengths
              </p>
              <ul className="space-y-2 text-sm">
                {score.explanation.standout_strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald">·</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <p className="flex items-center gap-1.5 text-sm font-medium text-amber mb-3">
                <AlertTriangle className="size-4" />
                Key Risks
              </p>
              <ul className="space-y-2 text-sm">
                {score.explanation.key_risks.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber">·</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </p>
      {children}
    </div>
  );
}

function MiniStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-muted/60 p-2.5">
      <Icon className="size-3.5 text-muted-foreground mb-1" />
      <span className="font-display font-semibold text-sm">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

function DimensionExplanation({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-l-2 border-border pl-3">
      <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm">{text}</p>
    </div>
  );
}
