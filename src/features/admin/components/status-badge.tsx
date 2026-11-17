import { Badge } from "@/components/ui/badge";

const tone: Record<string, "default" | "secondary" | "outline" | "destructive"> =
  {
    new: "default",
    draft: "secondary",
    published: "default",
    archived: "outline",
    read: "secondary",
    reviewed: "secondary",
    spam: "destructive",
  };

export function StatusBadge({ value }: { value: string }) {
  return (
    <Badge variant={tone[value] ?? "outline"} className="capitalize">
      {value}
    </Badge>
  );
}
