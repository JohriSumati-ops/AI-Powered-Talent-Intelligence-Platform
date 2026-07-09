import { CheckCircle2, ThumbsUp, Search, XCircle } from "lucide-react";
import type { Recommendation } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { recommendationTone } from "@/lib/utils/scoring";

const ICONS: Record<Recommendation, React.ElementType> = {
  "Strong Hire": CheckCircle2,
  Hire: ThumbsUp,
  "Interview Further": Search,
  Pass: XCircle,
};

export function RecommendationBadge({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const Icon = ICONS[recommendation];
  return (
    <Badge tone={recommendationTone[recommendation]}>
      <Icon className="size-3.5" />
      {recommendation}
    </Badge>
  );
}
