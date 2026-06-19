import React from "react";
import StatCard from "./StatCard";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

interface DashbordStatsProps {
  revenue: string;
  orders: string;
  customers: string;
  products: string;
}

const DashbordStats = ({ revenue, orders, customers, products }: DashbordStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Revenue"
        value={revenue}
        icon={DollarSign}
        iconColor="text-emerald-100"
        bgColor="bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-teal-500/30"
      />
      <StatCard
        title="Orders"
        value={orders}
        icon={ShoppingCart}
        iconColor="text-blue-200"
        bgColor="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30"
      />
      <StatCard
        title="Customers"
        value={customers}
        icon={Users}
        iconColor="text-orange-100"
        bgColor="bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg shadow-rose-500/30"
      />
      <StatCard
        title="Products"
        value={products}
        icon={Package}
        iconColor="text-light"
        bgColor="bg-gradient-to-br from-slate-800 to-slate-950 text-white border border-slate-700 shadow-xl"
      />
    </div>
  );
};

export default DashbordStats;
