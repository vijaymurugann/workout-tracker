"use client";

import React from "react";

export default function StatCard({
  title,
  value,
  unit = "",
  subtitle,
  badge,
  badgeType = "positive",
  icon: Icon,
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between transition-all hover:border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-700">
            <Icon size={15} />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-semibold text-gray-500">{unit}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1 text-xs">
          {subtitle && <span className="text-gray-400">{subtitle}</span>}
          {badge && (
            <span
              className={`px-1.5 py-0.5 rounded-md font-medium text-[11px] ${
                badgeType === "positive"
                  ? "bg-emerald-50 text-emerald-600"
                  : badgeType === "neutral"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-amber-50 text-amber-600"
              }`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
