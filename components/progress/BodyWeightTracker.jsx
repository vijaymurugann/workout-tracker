"use client";

import React, { useState } from "react";
import { Scale, Plus, Trash2, TrendingDown, TrendingUp, X } from "lucide-react";
import BottomSheet from "@/components/BottomSheet";

export default function BodyWeightTracker({
  logs = [],
  onAddLog,
  onDeleteLog,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputWeight, setInputWeight] = useState("");
  const [inputNote, setInputNote] = useState("");

  const latestLog = logs[0];
  const earliestLog = logs[logs.length - 1];

  const currentWeight = latestLog ? latestLog.weight : 0;
  const initialWeight = earliestLog ? earliestLog.weight : 0;
  const change =
    latestLog && earliestLog
      ? Math.round((currentWeight - initialWeight) * 10) / 10
      : 0;

  // Chart coordinates
  const reversedLogs = [...logs].reverse();
  const weights = reversedLogs.map((l) => l.weight);
  const minW = weights.length ? Math.min(...weights) - 1 : 70;
  const maxW = weights.length ? Math.max(...weights) + 1 : 80;
  const range = maxW - minW || 1;

  const svgWidth = 320;
  const svgHeight = 110;
  const paddingX = 25;
  const paddingY = 15;

  const points = reversedLogs.map((log, i) => {
    const x =
      reversedLogs.length > 1
        ? paddingX + (i / (reversedLogs.length - 1)) * (svgWidth - 2 * paddingX)
        : svgWidth / 2;
    const y =
      svgHeight -
      paddingY -
      ((log.weight - minW) / range) * (svgHeight - 2 * paddingY);
    return { x, y, log };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  const handleSave = () => {
    const val = parseFloat(inputWeight);
    if (isNaN(val) || val <= 0) return;

    onAddLog({
      weight: val,
      note: inputNote.trim() || undefined,
    });

    setInputWeight("");
    setInputNote("");
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Body Weight Tracker
          </h3>
          <p className="text-xs text-gray-400">
            Track body composition progression
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-all cursor-pointer">
          <Plus size={14} />
          Log Weight
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50/80 rounded-lg mb-4">
        <div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">
            Current
          </span>
          <span className="text-base font-extrabold text-gray-900">
            {currentWeight ? `${currentWeight} kg` : "—"}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">
            Starting
          </span>
          <span className="text-base font-extrabold text-gray-700">
            {initialWeight ? `${initialWeight} kg` : "—"}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">
            Net Change
          </span>
          <span className="text-base font-extrabold flex items-center gap-0.5">
            {change <= 0 ? (
              <span className="text-emerald-600 flex items-center">
                <TrendingDown size={14} className="mr-0.5" />
                {change} kg
              </span>
            ) : (
              <span className="text-amber-600 flex items-center">
                <TrendingUp size={14} className="mr-0.5" />
                +{change} kg
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Weight Trend SVG */}
      {reversedLogs.length > 1 && (
        <div className="pt-2 pb-1">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-28 overflow-visible">
            <line
              x1={paddingX}
              y1={svgHeight - paddingY}
              x2={svgWidth - paddingX}
              y2={svgHeight - paddingY}
              stroke="#f1f5f9"
            />
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {points.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={4}
                className="fill-gray-900 stroke-white stroke-2"
              />
            ))}
          </svg>

          <div className="flex justify-between px-2 pt-1 text-[11px] font-medium text-gray-400">
            <span>{reversedLogs[0]?.date}</span>
            <span>{reversedLogs[reversedLogs.length - 1]?.date}</span>
          </div>
        </div>
      )}

      {/* History log entries */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">
          Recent Weigh-ins
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between py-2 px-2.5 rounded-lg bg-gray-50 text-xs">
              <div>
                <span className="font-semibold text-gray-900">
                  {log.weight} kg
                </span>
                {log.note && (
                  <span className="text-gray-400 ml-2">· {log.note}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-[11px]">{log.date}</span>
                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="text-gray-300 hover:text-rose-500 transition-colors p-0.5">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for adding weight log */}
      <BottomSheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">
              Log Today&apos;s Weight
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 74.5"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                autoFocus
                className="w-full p-2.5 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Note (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Morning fasted"
                value={inputNote}
                onChange={(e) => setInputNote(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!inputWeight}
              className="w-full py-3 mt-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all cursor-pointer">
              Save Weigh-in
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
