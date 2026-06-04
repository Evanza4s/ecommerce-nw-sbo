"use client";

import Card from "@/components/ui/Card"; // Sesuaikan path jika berbeda
import { Activity, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { label: "Mon", value: 2.4 },
  { label: "Tue", value: 3.1 },
  { label: "Wed", value: 2.8 },
  { label: "Thu", value: 4.2 },
  { label: "Fri", value: 5.0 },
  { label: "Sat", value: 4.5 },
  { label: "Sun", value: 3.7 },
];

// Data diubah menjadi produk pakaian
const topProducts = [
  { name: "Jaket Denim Oversize", revenue: "Rp. 9.2 Juta" },
  { name: "Kemeja Flanel Premium", revenue: "Rp. 7.5 Juta" },
  { name: "Kaos Basic Cotton", revenue: "Rp. 5.8 Juta" },
];

const RevenueChart = () => {
  const totalRevenue = "Rp. 25.000.000";
  const averageOrderValue = "Rp. 102.000";
  const growth = "+18.4%";

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Revenue Performance
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Weekly Revenue
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Overview pendapatan untuk 7 hari terakhir, cocok untuk monitoring
            e-commerce.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold">Growth {growth}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="flex flex-col justify-between">
          <div className="w-full min-h-65">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="95%" stopColor="#6ee7b7" stopOpacity={1} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(value) => `${value}M`}
                />

                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => {
                    const rawValue = Array.isArray(value) ? value[0] : value;
                    const formatted =
                      typeof rawValue === "number"
                        ? rawValue
                        : Number(rawValue ?? 0);
                    return [`Rp. ${formatted} Juta`, "Revenue"];
                  }}
                  labelStyle={{ color: "#64748b", marginBottom: "4px" }}
                />

                <Bar
                  dataKey="value"
                  fill="url(#colorRevenue)"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-3xl bg-slate-50 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Total Revenue
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {totalRevenue}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Avg. Order
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {averageOrderValue}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Top products</p>
              <p className="text-xs text-slate-500">
                Produk dengan pendapatan tertinggi minggu ini
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {topProducts.map((product) => (
              <div
                key={product.name}
                className="rounded-2xl bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <span className="text-sm text-slate-500">
                    {product.revenue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RevenueChart;