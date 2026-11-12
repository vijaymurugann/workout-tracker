"use client";

import React, { useState } from "react";
import { BarChart3 } from "lucide-react";

export default function VolumeChart({ days = [] }) {
  const [activeDayIndex, setActiveDayIndex] = useState(null);

  const maxVolume = Math.max(...days.map((d) => d.volume), 1000);
  const totalVolume = days.reduce((acc, d) => acc + d.volume, 0);

  const activeDay =
    activeDayIndex !== null ? days[activeDayIndex] : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Volume Lifted
          </h3>
          <p className="text-xs text-gray-400">
            {activeDay ? (
              <span className="text-gray-900 font-medium">
                {activeDay.name} ({activeDay.focus}):{" "}
                <strong className="text-emerald-600">
                  {activeDay.volume.toLocaleString()} kg
                </strong>
              </span>
            ) : (
              `Total: ${totalVolume.toLocaleString()} kg this week`
            )}
          </p>
        </div>
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-700">
          <BarChart3 size={15} />
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="mt-4 pt-2">
        <div className="h-40 flex items-end justify-between gap-2 px-1">
          {days.map((day, idx) => {
            const heightPercent =
              day.volume > 0
                ? Math.max(12, Math.round((day.volume / maxVolume) * 100))
                : 6;
            const isHovered = activeDayIndex === idx;

            return (
              <div
                key={day.dayId || idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setActiveDayIndex(idx)}
                onMouseLeave={() => setActiveDayIndex(null)}
                onClick={() =>
                  setActiveDayIndex(activeDayIndex === idx ? null : idx)
                }>
                {/* Volume tooltip */}
                <div
                  className={`text-[10px] font-medium text-gray-500 mb-1 transition-opacity ${
                    isHovered ? "opacity-100 text-gray-900 font-bold" : "opacity-0 group-hover:opacity-100"
                  }`}>
                  {day.volume > 0 ? `${Math.round(day.volume / 1000 * 10) / 10}k` : "0"}
                </div>

                {/* Bar */}
                <div className="w-full max-w-[32px] bg-gray-100 rounded-t-md relative flex items-end overflow-hidden"
                  style={{ height: "100%" }}>
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      day.isRestDay
                        ? "bg-gray-200"
                        : isHovered
                        ? "bg-gray-900"
                        : day.volume > 0
                        ? "bg-emerald-500"
                        : "bg-gray-200"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day label */}
                <div className="mt-2 text-center">
                  <span
                    className={`text-[11px] font-semibold block transition-colors ${
                      isHovered
                        ? "text-gray-900"
                        : "text-gray-400 group-hover:text-gray-700"
                    }`}>
                    {day.shortName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
