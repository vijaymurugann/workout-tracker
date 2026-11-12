"use client";

import React from "react";
import { CheckCircle2, Circle, Clock, Coffee, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function WeeklyTracker({ days = [] }) {
  const completedCount = days.filter((d) => d.status === "completed").length;
  const targetCount = days.filter((d) => !d.isRestDay).length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Weekly Schedule
          </h3>
          <p className="text-xs text-gray-400">
            {completedCount} of {targetCount} training days completed
          </p>
        </div>
        <Link
          href="/workouts"
          className="inline-flex items-center text-xs font-medium text-gray-900 hover:text-emerald-600 transition-colors">
          Go to workout
          <ArrowUpRight size={14} className="ml-0.5" />
        </Link>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day) => {
          const isDone = day.status === "completed";
          const isPartial = day.status === "partial";
          const isRest = day.isRestDay;

          return (
            <div
              key={day.dayId || day.shortName}
              className={`flex flex-col items-center justify-between py-2.5 px-1 rounded-lg border text-center transition-all ${
                isDone
                  ? "bg-emerald-50/50 border-emerald-200"
                  : isPartial
                  ? "bg-amber-50/40 border-amber-200"
                  : isRest
                  ? "bg-gray-50 border-gray-100"
                  : "bg-white border-gray-100"
              }`}>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {day.shortName}
              </span>

              <div className="my-1.5 flex items-center justify-center">
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 size={14} />
                  </div>
                ) : isPartial ? (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs text-[10px] font-bold">
                    {day.completedCount}
                  </div>
                ) : isRest ? (
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Coffee size={12} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-gray-300 text-transparent flex items-center justify-center">
                    <Circle size={10} className="text-gray-200" />
                  </div>
                )}
              </div>

              <span
                className={`text-[10px] font-medium truncate w-full px-0.5 ${
                  isDone
                    ? "text-emerald-700 font-semibold"
                    : isRest
                    ? "text-gray-400"
                    : "text-gray-700"
                }`}>
                {day.focus}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
