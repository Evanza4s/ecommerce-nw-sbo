import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type PriceSummaryRow = {
  label: string;
  value: string;
  isNegative?: boolean;
};

type PriceSummaryProps = {
  title: string;
  rows: PriceSummaryRow[];
  total: string;
  children?: ReactNode;
  className?: string;
};

const PriceSummary = ({ title, rows, total, children, className }: PriceSummaryProps) => {
  return (
    <div className={cn("rounded-2xl bg-white p-6 shadow-md", className)}>
      <h3 className="mb-4 text-2xl font-bold">{title}</h3>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between">
            <span>{row.label}</span>
            <span className={row.isNegative ? "text-red-600" : undefined}>
              {row.isNegative ? `- ${row.value}` : row.value}
            </span>
          </div>
        ))}
      </div>
      <div className="my-4 border-t" />
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{total}</span>
      </div>
      {children}
    </div>
  );
};

export { PriceSummary, type PriceSummaryRow };
