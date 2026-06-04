import Card from "@/components/ui/Card";

interface AdminMetricCardItem {
  label: string;
  value: string;
  description: string;
}

interface AdminMetricCardsProps {
  items: AdminMetricCardItem[];
}

const AdminMetricCards = ({ items }: AdminMetricCardsProps) => {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="border p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">
            {item.value}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default AdminMetricCards;
