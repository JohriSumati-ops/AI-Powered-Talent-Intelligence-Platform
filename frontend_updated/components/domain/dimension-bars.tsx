import { Progress } from "@/components/ui/progress";
import { scoreTone } from "@/lib/utils/scoring";
import type { CandidateScore } from "@/lib/types";

const DIMENSIONS: {
  key: keyof Pick<
    CandidateScore,
    "skill_score" | "experience_score" | "trajectory_score" | "behavior_score" | "potential_score"
  >;
  label: string;
}[] = [
  { key: "skill_score", label: "Skill Match" },
  { key: "experience_score", label: "Experience Relevance" },
  { key: "trajectory_score", label: "Career Trajectory" },
  { key: "behavior_score", label: "Behavioral Signals" },
  { key: "potential_score", label: "Hidden Potential" },
];

export function DimensionBars({ score }: { score: CandidateScore }) {
  return (
    <div className="space-y-3">
      {DIMENSIONS.map((dim) => {
        const value = score[dim.key];
        return (
          <div key={dim.key}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{dim.label}</span>
              <span className="font-medium">{value.toFixed(1)}</span>
            </div>
            <Progress value={value} tone={scoreTone(value)} />
          </div>
        );
      })}
    </div>
  );
}
