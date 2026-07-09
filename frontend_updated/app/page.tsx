import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  FileSearch,
  ListOrdered,
  ScanSearch,
  Sparkles,
  Users2,
  GitCompareArrows,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CAPABILITIES = [
  {
    icon: FileSearch,
    title: "Intelligent JD Parsing",
    description:
      "Turn raw job postings into structured signal — required vs. preferred skills, seniority, domain, and culture cues.",
  },
  {
    icon: ListOrdered,
    title: "Multi-Dimensional Ranking",
    description:
      "Skill match, experience relevance, career trajectory, behavioral signals, and hidden potential — scored, not guessed.",
  },
  {
    icon: Sparkles,
    title: "Explainable Recommendations",
    description:
      "Every score ships with a plain-language reason, standout strengths, and key risks — no black box.",
  },
  {
    icon: ScanSearch,
    title: "Semantic Retrieval",
    description:
      "Search your pool in plain English — FAISS-backed similarity search that goes beyond keyword filters.",
  },
  {
    icon: GitCompareArrows,
    title: "Head-to-Head Comparison",
    description:
      "Put two candidates side by side across every scoring dimension to settle close calls fast.",
  },
  {
    icon: BrainCircuit,
    title: "Recruiter AI Copilot",
    description:
      "Ask follow-up questions about your ranked pool and get grounded answers referencing real candidate data.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BrainCircuit className="size-4.5" />
          </div>
          <span className="font-display font-semibold">Talent Intelligence Engine</span>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/dashboard">
            Open workspace
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </header>

      <section className="relative mesh-glow overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 pt-20 pb-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            AI intelligence, not keyword matching
          </div>
          <h1 className="text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            Hiring is broken.
            <br />
            <span className="gradient-text">We built intelligence for it.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Recruiters review hundreds of profiles and still miss exceptional
            candidates. The Talent Intelligence Engine replicates recruiter
            judgment across skill, experience, trajectory, behavior, and
            hidden potential — fully explained.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/jd-parser">
                Start with a job description
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
              Core capabilities
            </p>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Recruiter intelligence, end to end
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap) => (
            <Card key={cap.title} className="p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary-muted text-primary">
                <cap.icon className="size-5" />
              </div>
              <h3 className="font-medium mb-1.5">{cap.title}</h3>
              <p className="text-sm text-muted-foreground">{cap.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>Talent Intelligence Engine · v2.0.0</span>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Workspace
            </Link>
            <Link href="/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
