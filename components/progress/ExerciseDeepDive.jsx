"use client";

import React, { useState } from "react";
import { Dumbbell, TrendingUp, Info } from "lucide-react";

export default function ExerciseDeepDive({
  exercises = [],
  selectedExercise,
  onSelectExercise,
  progressData = [],
}) {
  const [activePoint, setActivePoint] = useState(null);

  const currentExercise = selectedExercise || (exercises[0] || "Flat bench press");

  // Determine min and max for chart scaling
  const weights = progressData.map((p) => p.weight);
  const minWeight = Math.max(0, Math.min(...weights, 50) - 10);
  const maxWeight = Math.max(...weights, 100) + 10;
  const weightRange = maxWeight - minWeight || 1;

  // Chart coordinates
  const svgWidth = 320;
  const svgHeight = 120;
  const paddingX = 25;
  const paddingY = 20;

  const pointsCoordinates = progressData.map((pt, i) => {
    const x =
      progressData.length > 1
        ? paddingX + (i / (progressData.length - 1)) * (svgWidth - 2 * paddingX)
        : svgWidth / 2;
    const y =
      svgHeight -
      paddingY -
      ((pt.weight - minWeight) / weightRange) * (svgHeight - 2 * paddingY);
    return { x, y, pt };
  });

  const pathD = pointsCoordinates.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  // Area path for gradient fill
  const areaD =
    pointsCoordinates.length > 0
      ? `${pathD} L ${pointsCoordinates[pointsCoordinates.length - 1].x} ${
          svgHeight - paddingY
        } L ${pointsCoordinates[0].x} ${svgHeight - paddingY} Z`
      : "";

  const latest = progressData[progressData.length - 1];
  const earliest = progressData[0];
  const totalGain =
    latest && earliest ? Math.round((latest.weight - earliest.weight) * 10) / 10 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs">
      {/* Header and selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Exercise Progression
          </h3>
          <p className="text-xs text-gray-400">
            Track weight & 1RM curve over time
          </p>
        </div>

        {/* Dropdown Select */}
        <select
          value={currentExercise}
          onChange={(e) => onSelectExercise(e.target.value)}
          className="text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900">
          {exercises.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Highlights summary */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50/80 rounded-lg mb-4">
        <div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">
            Latest Max
          </span>
          <span className="text-base font-extrabold text-gray-900">
            {latest ? `${latest.weight} kg` : "—"}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">
            Est. 1RM
          </span>
          <span className="text-base font-extrabold text-emerald-600">
            {latest ? `${latest.est1RM} kg` : "—"}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">
            Gain
          </span>
          <span className="text-base font-extrabold text-gray-900 flex items-center">
            {totalGain > 0 ? (
              <span className="text-emerald-600">+{totalGain} kg</span>
            ) : (
              `${totalGain} kg`
            )}
          </span>
        </div>
      </div>

      {/* SVG Trend Chart */}
      <div className="relative pt-2 pb-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-36 overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={svgWidth - paddingX}
            y2={paddingY}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={svgHeight - paddingY}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingY}
            stroke="#f1f5f9"
          />

          {/* Area fill */}
          {areaD && <path d={areaD} fill="url(#chartGradient)" />}

          {/* Line stroke */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Points */}
          {pointsCoordinates.map((c, idx) => {
            const isHovered = activePoint === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setActivePoint(idx)}
                onMouseLeave={() => setActivePoint(null)}
                onClick={() => setActivePoint(activePoint === idx ? null : idx)}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 6 : 4}
                  className={`transition-all duration-200 ${
                    isHovered
                      ? "fill-gray-900 stroke-white stroke-2"
                      : "fill-emerald-500 stroke-white stroke-2"
                  }`}
                />
              </g>
            );
          })}
        </svg>

        {/* Labels below chart */}
        <div className="flex justify-between px-2 pt-1 text-[11px] font-medium text-gray-400">
          {progressData.map((p, idx) => (
            <span
              key={idx}
              className={`transition-colors ${
                activePoint === idx ? "text-gray-900 font-bold" : ""
              }`}>
              {p.label}
            </span>
          ))}
        </div>

        {/* Floating tooltip when tapped/hovered */}
        {activePoint !== null && pointsCoordinates[activePoint] && (
          <div className="mt-3 p-2 rounded-lg bg-gray-900 text-white text-xs flex justify-between items-center transition-all">
            <span>
              <strong>{pointsCoordinates[activePoint].pt.label}</strong>:{" "}
              {pointsCoordinates[activePoint].pt.weight} kg ×{" "}
              {pointsCoordinates[activePoint].pt.reps} reps
            </span>
            <span className="text-emerald-400 font-bold ml-2">
              1RM: {pointsCoordinates[activePoint].pt.est1RM} kg
            </span>
          </div>
        )}
      </div>

      {/* Log History */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">
          Session History
        </h4>
        <div className="space-y-1.5">
          {progressData.slice().reverse().map((entry, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-2 rounded-md bg-gray-50 text-xs">
              <span className="font-medium text-gray-700">{entry.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">
                  {entry.weight} kg × {entry.reps} reps
                </span>
                <span className="font-bold text-gray-900">
                  1RM: {entry.est1RM} kg
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
