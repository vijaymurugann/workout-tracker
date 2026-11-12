"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { BottomSheet } from "./BottomSheet";
import { splitPresets, initialWorkoutData } from "@/const/data";
import { X, Check, Dumbbell, Sparkles, Layers, Info } from "lucide-react";

export default function SplitSelectorModal({
  isOpen,
  onClose,
  currentSplitId,
  onSelectSplit,
}) {
  const [selectedId, setSelectedId] = useState(currentSplitId || "modern-hypertrophy");

  if (!isOpen) return null;

  const handleApply = () => {
    onSelectSplit(selectedId);
    onClose();
  };

  const modalContent = (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className="bg-white rounded-t-3xl overflow-hidden shadow-2xl pb-6 border-t border-gray-100"
      backdropClassName="backdrop-blur-sm bg-black/40"
      style={{ zIndex: 9999 }}>
      <div className="p-5 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <Layers size={20} className="text-gray-900" />
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Workout Splits
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Choose an evidence-based training split suited to your schedule & goals.
            </p>
          </div>
          <button
            aria-label="Close modal"
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Split Cards List */}
        <div className="space-y-3 mb-5">
          {splitPresets.map((split) => {
            const isSelected = selectedId === split.id;
            const isCurrentActive = currentSplitId === split.id;

            return (
              <div
                key={split.id}
                onClick={() => setSelectedId(split.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? "border-gray-900 bg-gray-50/50 shadow-sm"
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}>
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-gray-900">
                      {split.name}
                    </span>
                    {split.tag && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {split.tag}
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-gray-900 border-gray-900 text-white"
                        : "border-gray-300"
                    }`}>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {split.description}
                </p>

                {/* Days mini pills */}
                <div className="flex flex-wrap gap-1">
                  {split.days.map((day) => (
                    <span
                      key={day.id}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                        day.isRestDay
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      <strong className="font-semibold">{day.shortName}:</strong>{" "}
                      {day.focus.split("(")[0].trim()}
                    </span>
                  ))}
                </div>

                {isCurrentActive && (
                  <span className="absolute top-2 right-9 text-[10px] font-bold text-gray-400">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Scientific Context Tip */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5 mb-5 text-blue-900">
          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <strong>Pro Tip:</strong> Hypertrophy research shows that training muscle groups
            <strong> 2× per week</strong> (like Modern Hypertrophy or PPL) produces superior
            gains compared to training them only once per week.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleApply}
          className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 active:scale-[0.98] transition shadow-sm flex items-center justify-center gap-2">
          <span>Apply Selected Split</span>
        </button>
      </div>
    </BottomSheet>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
