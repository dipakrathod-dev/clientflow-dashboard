import React from "react";

export function StatCard({ title, value, icon, change, trend }) {
  const isUp = trend === "up";

  return (
    <div className="bg-[#131826] border border-[#1f293d] rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xl font-bold">
            {icon}
          </div>

          {change && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                isUp
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
              }`}
            >
              <span>{isUp ? "↑" : "↓"}</span>
              <span>{change}</span>
            </div>
          )}
        </div>

        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
          {title}
        </p>

        <h3 className="text-4xl font-bold text-white mt-1 tracking-tight">
          {value}
        </h3>
      </div>

      <div className="mt-5 pt-3 border-t border-[#1f293d]/60 flex justify-end">
        <svg className="w-20 h-6 text-purple-500/50 stroke-current fill-none stroke-2 overflow-visible">
          <path
            d={
              isUp
                ? "M0 18 Q 12 14, 24 8 T 48 10 T 72 2"
                : "M0 2 Q 12 8, 24 14 T 48 10 T 72 18"
            }
          />
        </svg>
      </div>
    </div>
  );
}

export default StatCard;