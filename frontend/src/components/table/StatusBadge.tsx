import { Badge } from "@/components/ui/badge";

interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {
  switch (status) {
    case "active":
      return <Badge>Active</Badge>;

    case "draft":
      return <Badge variant="secondary">Draft</Badge>;

    case "archived":
      return (
        <Badge variant="outline">
          Archived
        </Badge>
      );

    default:
      return null;
  }
}