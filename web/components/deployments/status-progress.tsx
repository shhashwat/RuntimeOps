import { Badge } from "@/components/ui/badge";

const STAGES = ["QUEUED", "BUILDING", "DEPLOYING", "HEALTH_CHECK", "SUCCESS"];

interface Props {
  status: string;
}

export function StatusProgress({ status }: Props) {
  const currentIndex = STAGES.indexOf(status);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {STAGES.map((stage, index) => (
        <div key={stage} className="flex items-center gap-2">
          <Badge variant={index <= currentIndex ? "default" : "secondary"}>
            {stage}
          </Badge>

          {index < STAGES.length - 1 && <span>→</span>}
        </div>
      ))}
    </div>
  );
}
