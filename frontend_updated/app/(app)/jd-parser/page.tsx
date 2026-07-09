"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ClipboardPaste,
  Sparkles,
  ArrowRight,
  Briefcase,
  Layers,
  Target,
  Users,
  Gauge,
  FileWarning,
} from "lucide-react";
import { PageHeader } from "@/components/domain/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AIThinking } from "@/components/domain/ai-thinking";
import { EmptyState } from "@/components/domain/empty-state";
import { useParseJD } from "@/lib/hooks/use-api";
import { useSessionStore } from "@/lib/store/session-store";
import { DEMO_JD_TEXT } from "@/lib/data/demo-candidates";
import { ApiError } from "@/lib/api/client";

export default function JDParserPage() {
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const { mutate, data: parsedJd, isPending, error, reset } = useParseJD();
  const setParsedJD = useSessionStore((s) => s.setParsedJD);

  const charCount = jdText.trim().length;
  const tooShort = charCount > 0 && charCount < 20;

  function handleParse() {
    if (charCount < 20) {
      toast.error("Job description text is too short to parse. Add a bit more detail.");
      return;
    }
    mutate(jdText, {
      onSuccess: (data) => {
        setParsedJD(data);
        toast.success("Job description parsed successfully.");
      },
      onError: (err) => {
        const message = err instanceof ApiError ? err.detail : "Failed to parse job description.";
        toast.error(message);
      },
    });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Job Parser"
        title="Turn job postings into structured requirements"
        description="Paste a job description — the parser extracts title, skills, responsibilities, seniority, and culture signals automatically."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <ClipboardPaste className="size-4" />
              Job Description
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Textarea
              rows={14}
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value);
                if (parsedJd) reset();
              }}
              placeholder="Paste the full job description here — the parser reads title, requirements, responsibilities, and tone straight from the text."
              className="font-mono text-[13px]"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{charCount} characters</span>
              <button
                className="text-primary hover:underline"
                onClick={() => setJdText(DEMO_JD_TEXT)}
                type="button"
              >
                Use sample JD
              </button>
            </div>
            {tooShort && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-amber">
                <FileWarning className="size-3.5" />
                Add more detail — the backend requires at least 20 characters.
              </p>
            )}
            <Button
              className="w-full mt-4"
              onClick={handleParse}
              disabled={isPending || charCount < 20}
            >
              <Sparkles className="size-4" />
              {isPending ? "Parsing..." : "Parse Job Description"}
            </Button>
            {isPending && (
              <div className="mt-3">
                <AIThinking label="Reading requirements, tone, and seniority" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Layers className="size-4" />
              Parsed Output
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isPending && (
              <div className="space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}

            {!isPending && !parsedJd && !error && (
              <EmptyState
                icon={Layers}
                title="Nothing parsed yet"
                description="Your structured job requirements will appear here once parsed."
              />
            )}

            {!isPending && error && (
              <EmptyState
                icon={FileWarning}
                title="Parsing failed"
                description={
                  error instanceof ApiError
                    ? error.detail
                    : "Something went wrong reaching the backend."
                }
              />
            )}

            {!isPending && parsedJd && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Briefcase className="size-3.5" /> Title
                  </p>
                  <p className="text-lg font-display font-semibold">
                    {parsedJd.title ?? "Not specified"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {parsedJd.seniority && <Badge tone="primary">{parsedJd.seniority}</Badge>}
                    {parsedJd.team_type && <Badge tone="outline">{parsedJd.team_type}</Badge>}
                    {parsedJd.domain && <Badge tone="outline">{parsedJd.domain}</Badge>}
                    {parsedJd.min_experience_years != null && (
                      <Badge tone="outline">{parsedJd.min_experience_years}+ yrs</Badge>
                    )}
                  </div>
                </div>

                <SkillGroup title="Required Skills" skills={parsedJd.required_skills} tone="primary" />
                <SkillGroup title="Preferred Skills" skills={parsedJd.preferred_skills} tone="outline" />

                {parsedJd.responsibilities.length > 0 && (
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <Target className="size-3.5" /> Responsibilities
                    </p>
                    <ul className="space-y-1.5 text-sm">
                      {parsedJd.responsibilities.map((r, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">·</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {parsedJd.culture_signals.length > 0 && (
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <Users className="size-3.5" /> Culture Signals
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedJd.culture_signals.map((s) => (
                        <Badge key={s} tone="emerald">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {parsedJd.jd_quality_notes && (
                  <div className="rounded-lg bg-muted/60 p-3 text-sm">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Gauge className="size-3.5" /> JD Quality Notes
                    </p>
                    {parsedJd.jd_quality_notes}
                  </div>
                )}

                <Button className="w-full" onClick={() => router.push("/ranking")}>
                  Continue to Candidate Ranking
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SkillGroup({
  title,
  skills,
  tone,
}: {
  title: string;
  skills: string[];
  tone: "primary" | "outline";
}) {
  if (skills.length === 0) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <Badge key={s} tone={tone}>
            {s}
          </Badge>
        ))}
      </div>
    </div>
  );
}
