"use client";

import React from "react";
import { Activity } from "lucide-react";

const COLORS = {
  Chest: { bar: "bg-blue-500", text: "text-blue-600", dot: "bg-blue-500" },
  Back: { bar: "bg-emerald-500", text: "text-emerald-600", dot: "bg-emerald-500" },
  Legs: { bar: "bg-indigo-500", text: "text-indigo-600", dot: "bg-indigo-500" },
  Arms: { bar: "bg-purple-500", text: "text-purple-600", dot: "bg-purple-500" },
  Shoulders: { bar: "bg-amber-500", text: "text-amber-600", dot: "bg-amber-500" },
  Cardio: { bar: "bg-rose-500", text: "text-rose-600", dot: "bg-rose-500" },
};

export default function MuscleDistribution({ distribution = [] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Muscle Focus
          </h3>
          <p className="text-xs text-gray-400">
            Weekly training split distribution
          </p>
        </div>
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-700">
          <Activity size={15} />
        </div>
      </div>

      {/* Segmented bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-gray-100 my-3 gap-0.5">
        {distribution.map((item) => {
          const color = COLORS[item.name] || { bar: "bg-gray-400" };
          return (
            <div
              key={item.name}
              className={`${color.bar} transition-all duration-300`}
              style={{ width: `${Math.max(item.percentage, 4)}%` }}
              title={`${item.name}: ${item.percentage}%`}
            />
          );
        })}
      </div>

      {/* Breakdown list */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
        {distribution.map((item) => {
          const color = COLORS[item.name] || {
            text: "text-gray-700",
            dot: "bg-gray-400",
          };
          return (
            <div
              key={item.name}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50/70 border border-gray-100/60">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`w-2 h-2 rounded-full ${color.dot} shrink-0`} />
                <span className="text-xs font-medium text-gray-700 truncate">
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0 ml-1">
                <span className="text-xs font-bold text-gray-900">
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
