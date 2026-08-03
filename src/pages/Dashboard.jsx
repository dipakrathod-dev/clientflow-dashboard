import React from "react";
import StatCard from "../components/StateCard";
import { statsData } from "../data/stats";

export function Dashboard() {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#0b0f19] min-h-screen text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f293d] pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <span>👋</span> Welcome back, Dipak
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            "Have a productive day!" — Here's an overview of your freelance business today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#131826] border border-[#1f293d] px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-medium text-purple-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Today's Summary
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;