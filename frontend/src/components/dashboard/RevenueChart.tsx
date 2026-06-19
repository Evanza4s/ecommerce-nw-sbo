"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { Activity, TrendingUp, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ordersApi } from "@/server/index";
import type { RevenueStatsResponse } from "@/server/modules/orders/types";

// Fallback data
const fallbackRevenueData = [
  { label: "Mon", value: 0 },
  { label: "Tue", value: 0 },
  { label: "Wed", value: 0 },
  { label: "Thu", value: 0 },
  { label: "Fri", value: 0 },
  { label: "Sat", value: 0 },
  { label: "Sun", value: 0 },
];

const fallbackTopProducts = [
  { name: "Belum ada data", revenue: "Rp. 0" },
];

const RevenueChart = () => {
  const [stats, setStats] = useState<RevenueStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await ordersApi.getRevenueStats();
        if (res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load revenue stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = stats?.revenue_data?.length ? stats.revenue_data : fallbackRevenueData;
  const topProductsList = stats?.top_products?.length ? stats.top_products : fallbackTopProducts;
  const totalRev = stats?.total_revenue || "Rp. 0";
  const avgOrderVal = stats?.average_order_value || "Rp. 0";
  const growthRate = stats?.growth || "0%";

  if (isLoading) {
    return (
      <Card className="p-6 min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

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
          <span className="font-semibold">Growth {growthRate}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="flex flex-col justify-between">
          <div className="w-full min-h-65">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={chartData}
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
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value;
                  }}
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
                    const formatted = typeof rawValue === "number" ? rawValue : Number(rawValue ?? 0);
                    // Recharts tooltip format
                    let displayVal = `${formatted}`;
                    if (formatted >= 1000000) displayVal = `Rp. ${(formatted / 1000000).toFixed(1)} Juta`;
                    else displayVal = `Rp. ${formatted.toLocaleString('id-ID')}`;
                    return [displayVal, "Revenue"];
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
                {totalRev}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Avg. Order
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {avgOrderVal}
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
            {topProductsList.map((product, idx) => (
              <div
                key={`${product.name}-${idx}`}
                className="rounded-2xl bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900 line-clamp-1 flex-1 pr-2" title={product.name}>{product.name}</p>
                  <span className="text-sm text-slate-500 whitespace-nowrap">
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