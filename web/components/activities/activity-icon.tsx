import { Rocket, CheckCircle, FolderGit2, RefreshCw } from "lucide-react";

export function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "PROJECT_CREATED":
      return <FolderGit2 className="h-4 w-4" />;

    case "DEPLOYMENT_TRIGGERED":
      return <Rocket className="h-4 w-4" />;

    case "DEPLOYMENT_SUCCEEDED":
      return <CheckCircle className="h-4 w-4" />;

    default:
      return <RefreshCw className="h-4 w-4" />;
  }
}
