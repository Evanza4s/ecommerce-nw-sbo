import React from "react";
import StatCard from "./StatCard";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

const DashbordStats = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Revenue"
        value="Rp. 25.000.000"
        icon={DollarSign}
        iconColor="text-emerald-100"
        bgColor="bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-teal-500/30"
      />
      <StatCard
        title="Orders"
        value="245"
        icon={ShoppingCart}
        iconColor="text-blue-200"
        bgColor="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30"
      />
      <StatCard
        title="Customers"
        value="1,250"
        icon={Users}
        iconColor="text-orange-100"
        bgColor="bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg shadow-rose-500/30"
      />
      <StatCard
        title="Products"
        value="520"
        icon={Package}
        iconColor="text-light"
        bgColor="bg-gradient-to-br from-slate-800 to-slate-950 text-white border border-slate-700 shadow-xl"
      />
    </div>
  );
};

export default DashbordStats;
