"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import type { Candidate } from "@/lib/types";
import { toast } from "sonner";

const EMPTY_FORM = {
  name: "",
  title: "",
  skills: "",
  experience_years: "",
  past_roles: "",
  role_progression: "",
  github_activity_score: "50",
  certifications: "",
  hackathons: "0",
  learning_consistency_score: "50",
  bio: "",
};

function toList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function ManualCandidateDialog({
  onAdd,
}: {
  onAdd: (candidate: Candidate) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function update<K extends keyof typeof EMPTY_FORM>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.title.trim()) {
      toast.error("Name and title are required.");
      return;
    }

    const candidate: Candidate = {
      candidate_id: `MANUAL_${Date.now()}`,
      name: form.name.trim(),
      title: form.title.trim(),
      skills: toList(form.skills),
      experience_years: Number(form.experience_years) || 0,
      past_roles: toList(form.past_roles),
      role_progression: toList(form.role_progression),
      github_activity_score: clamp(Number(form.github_activity_score)),
      certifications: toList(form.certifications),
      hackathons: Number(form.hackathons) || 0,
      learning_consistency_score: clamp(Number(form.learning_consistency_score)),
      bio: form.bio.trim(),
    };

    onAdd(candidate);
    toast.success(`${candidate.name} added to the candidate pool.`);
    setForm(EMPTY_FORM);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Plus className="size-4" />
          Add candidate manually
        </Button>
      </DialogTrigger>
      <DialogContent title="Add a candidate" className="max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full name">
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Doe" />
            </Field>
            <Field label="Current title">
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Senior ML Engineer" />
            </Field>
          </div>

          <Field label="Skills (comma-separated)">
            <Input value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="Python, PyTorch, LLM" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Years of experience">
              <Input type="number" min={0} value={form.experience_years} onChange={(e) => update("experience_years", e.target.value)} />
            </Field>
            <Field label="Hackathons attended">
              <Input type="number" min={0} value={form.hackathons} onChange={(e) => update("hackathons", e.target.value)} />
            </Field>
          </div>

          <Field label="Past roles (comma-separated)">
            <Input value={form.past_roles} onChange={(e) => update("past_roles", e.target.value)} placeholder="Data Scientist, ML Engineer" />
          </Field>

          <Field label="Role progression, oldest → newest (comma-separated)">
            <Input value={form.role_progression} onChange={(e) => update("role_progression", e.target.value)} placeholder="Data Scientist, ML Engineer" />
          </Field>

          <Field label="Certifications (comma-separated)">
            <Input value={form.certifications} onChange={(e) => update("certifications", e.target.value)} placeholder="AWS ML Specialty" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="GitHub activity (0-100)">
              <Input type="number" min={0} max={100} value={form.github_activity_score} onChange={(e) => update("github_activity_score", e.target.value)} />
            </Field>
            <Field label="Learning consistency (0-100)">
              <Input type="number" min={0} max={100} value={form.learning_consistency_score} onChange={(e) => update("learning_consistency_score", e.target.value)} />
            </Field>
          </div>

          <Field label="Bio">
            <Textarea rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Short professional summary..." />
          </Field>

          <Button type="submit" className="w-full">
            Add to candidate pool
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function clamp(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}
