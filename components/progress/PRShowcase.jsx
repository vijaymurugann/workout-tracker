"use client";

import React from "react";
import { Trophy, TrendingUp, Zap } from "lucide-react";

export default function PRShowcase({ personalRecords = [], onSelectExercise }) {
  const topPR = personalRecords[0];

  return (
    <div className="space-y-3">
      {/* Top PR Banner */}
      {topPR && (
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold tracking-wide">
                <Trophy size={12} className="text-amber-400" />
                HIGHEST ESTIMATED 1RM
              </div>
              <h4 className="text-xl font-bold tracking-tight text-white mt-1">
                {topPR.exerciseName}
              </h4>
              <p className="text-xs text-gray-300">
                Lifted {topPR.weight} kg × {topPR.reps} reps · Est. 1RM:{" "}
                <strong className="text-amber-400">{topPR.est1RM} kg</strong>
              </p>
            </div>
            {topPR.improvementKg > 0 && (
              <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                <TrendingUp size={12} />
                +{topPR.improvementKg} kg
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid of All PRs */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Personal Records
            </h3>
            <p className="text-xs text-gray-400">
              Heaviest sets and calculated 1 Rep Max
            </p>
          </div>
          <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-700">
            <Trophy size={15} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {personalRecords.map((pr) => (
            <div
              key={pr.exerciseName}
              onClick={() => onSelectExercise && onSelectExercise(pr.exerciseName)}
              className="p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50/60 transition-all cursor-pointer flex flex-col justify-between group">
              <div className="flex items-start justify-between gap-1 mb-2">
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                    {pr.focus}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-black">
                    {pr.exerciseName}
                  </h4>
                </div>
                {pr.improvementKg > 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 shrink-0">
                    +{pr.improvementKg} kg
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between pt-1 border-t border-gray-100/80">
                <div>
                  <span className="text-xs text-gray-400">Best Set: </span>
                  <span className="text-xs font-bold text-gray-900">
                    {pr.weight} kg × {pr.reps}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-400">1RM: </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    {pr.est1RM} kg
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
