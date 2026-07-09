"use client";

import Link from "next/link";
import {
  FileText,
  Users2,
  Sparkles,
  ArrowRight,
  ListOrdered,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PageHeader } from "@/components/domain/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/domain/score-ring";
import { EmptyState } from "@/components/domain/empty-state";
import { CandidateCard } from "@/components/domain/candidate-card";
import { useSessionStore } from "@/lib/store/session-store";
import { recommendationTone } from "@/lib/utils/scoring";
import type { Recommendation } from "@/lib/types";

const RECOMMENDATION_COLORS: Record<Recommendation, string> = {
  "Strong Hire": "hsl(var(--emerald))",
  Hire: "hsl(var(--primary))",
  "Interview Further": "hsl(var(--amber))",
  Pass: "hsl(var(--rose))",
};

export default function DashboardPage() {
  const { parsedJD, candidates, rankings, candidateSource } = useSessionStore();

  const avgScore =
    rankings.length > 0
      ? rankings.reduce((sum, r) => sum + r.final_score, 0) / rankings.length
      : 0;

  const recommendationCounts = rankings.reduce<Record<string, number>>((acc, r) => {
    const key = r.explanation.recommendation;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(recommendationCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const distributionBuckets = [
    { label: "0-49", min: 0, max: 49 },
    { label: "50-69", min: 50, max: 69 },
    { label: "70-84", min: 70, max: 84 },
    { label: "85-100", min: 85, max: 100 },
  ].map((bucket) => ({
    name: bucket.label,
    count: rankings.filter(
      (r) => r.final_score >= bucket.min && r.final_score <= bucket.max
    ).length,
  }));

  const topCandidates = rankings.slice(0, 3);

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Good to see you, recruiter"
        description="This snapshot reflects your current session — the parsed job description, candidate pool, and most recent ranking run."
        actions={
          <Button asChild>
            <Link href="/jd-parser">
              <Sparkles className="size-4" />
              New ranking run
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatusCard
          icon={FileText}
          label="Job description"
          value={parsedJD ? parsedJD.title ?? "Parsed" : "Not started"}
          tone={parsedJD ? "emerald" : "default"}
          href="/jd-parser"
          cta={parsedJD ? "View parsed JD" : "Parse a job description"}
        />
        <StatusCard
          icon={Users2}
          label="Candidate pool"
          value={
            candidates.length > 0
              ? `${candidates.length} candidates (${candidateSource ?? "loaded"})`
              : "Empty"
          }
          tone={candidates.length > 0 ? "emerald" : "default"}
          href="/ranking"
          cta={candidates.length > 0 ? "View candidates" : "Load candidates"}
        />
        <StatusCard
          icon={ListOrdered}
          label="Last ranking run"
          value={rankings.length > 0 ? `${rankings.length} scored` : "None yet"}
          tone={rankings.length > 0 ? "emerald" : "default"}
          href="/ranking"
          cta={rankings.length > 0 ? "View ranking" : "Run ranking"}
        />
      </div>

      {rankings.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No ranking run yet"
          description="Parse a job description and load a candidate pool to see AI-powered scoring, distributions, and top matches here."
          action={
            <Button asChild variant="secondary" size="sm">
              <Link href="/jd-parser">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
          className="mb-6"
        />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3 mb-6">
            <Card className="p-6 flex flex-col items-center justify-center lg:col-span-1">
              <ScoreRing score={avgScore} size={120} strokeWidth={9} label="avg score" />
              <p className="mt-4 text-sm text-muted-foreground text-center">
                System-wide match quality across your current ranking run
              </p>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>
                  <TrendingUp className="size-4" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionBuckets}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted))" }}
                      contentStyle={{
                        background: "hsl(var(--surface-raised))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>
                  <ShieldCheck className="size-4" />
                  Recommendation Mix
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 h-[180px] flex items-center gap-4">
                <ResponsiveContainer width="55%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={38}
                      outerRadius={60}
                      paddingAngle={3}
                    >
                      {pieData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={RECOMMENDATION_COLORS[entry.name as Recommendation]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 text-xs">
                  {pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{
                          background:
                            RECOMMENDATION_COLORS[entry.name as Recommendation],
                        }}
                      />
                      <span className="text-muted-foreground">{entry.name}</span>
                      <span className="ml-auto font-medium">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg">Top matches</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/ranking">
                View full ranking
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topCandidates.map((score, i) => (
              <CandidateCard key={score.candidate_id} score={score} rank={i + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  tone,
  href,
  cta,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: "emerald" | "default";
  href: string;
  cta: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4.5" />
        </div>
        <Badge tone={tone}>{tone === "emerald" ? "Ready" : "Pending"}</Badge>
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="mt-1 font-medium truncate">{value}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        {cta}
        <ArrowRight className="size-3" />
      </Link>
    </Card>
  );
}
