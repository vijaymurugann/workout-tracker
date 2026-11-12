"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { BottomSheet } from "./BottomSheet";
import {
  X,
  Plus,
  Trash2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Flame,
  CheckCircle2,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import { calculate1RM } from "@/lib/workout-storage";

export default function ExerciseModal({
  isOpen,
  onClose,
  exercise,
  onSave,
  isCardio = false,
}) {
  const [localExercise, setLocalExercise] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerTarget, setTimerTarget] = useState(90);
  const timerIntervalRef = useRef(null);

  // Sync state whenever modal opens with a new exercise
  useEffect(() => {
    if (exercise) {
      setLocalExercise(JSON.parse(JSON.stringify(exercise)));
    } else {
      setLocalExercise(null);
    }
  }, [exercise]);

  // Audio cue when rest timer finishes
  const playTimerChime = useCallback(() => {
    try {
      if (typeof window !== "undefined" && window.AudioContext) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch (e) {
      // Audio might be blocked by browser policy without user gesture
    }
  }, []);

  // Rest timer countdown effect
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerActive(false);
            playTimerChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive, timerSeconds, playTimerChime]);

  const startRestTimer = (seconds) => {
    setTimerTarget(seconds);
    setTimerSeconds(seconds);
    setTimerActive(true);
  };

  const toggleTimerPause = () => {
    setTimerActive((prev) => !prev);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
  };

  // Set management
  const handleSetChange = (index, field, value) => {
    if (!localExercise) return;
    const updatedSets = [...localExercise.sets];
    updatedSets[index] = {
      ...updatedSets[index],
      [field]: value,
    };
    setLocalExercise({
      ...localExercise,
      sets: updatedSets,
    });
  };

  const handleAdjustWeight = (index, delta) => {
    if (!localExercise) return;
    const currentWeight = parseFloat(localExercise.sets[index]?.weight) || 0;
    const newWeight = Math.max(0, currentWeight + delta);
    handleSetChange(index, "weight", newWeight > 0 ? String(newWeight) : "");
  };

  const handleAdjustReps = (index, delta) => {
    if (!localExercise) return;
    const currentReps = parseInt(localExercise.sets[index]?.reps, 10) || 0;
    const newReps = Math.max(0, currentReps + delta);
    handleSetChange(index, "reps", newReps > 0 ? String(newReps) : "");
  };

  const handleAddSet = () => {
    if (!localExercise) return;
    const lastSet = localExercise.sets[localExercise.sets.length - 1];
    setLocalExercise({
      ...localExercise,
      sets: [
        ...localExercise.sets,
        {
          reps: lastSet?.reps || "",
          weight: lastSet?.weight || "",
        },
      ],
    });
  };

  const handleDeleteSet = (index) => {
    if (!localExercise || localExercise.sets.length <= 1) return;
    const filtered = localExercise.sets.filter((_, i) => i !== index);
    setLocalExercise({
      ...localExercise,
      sets: filtered,
    });
  };

  // 1RM Calculation based on the best set logged
  const bestSet1RM = React.useMemo(() => {
    if (!localExercise || !localExercise.sets || isCardio) return 0;
    let max1RM = 0;
    localExercise.sets.forEach((set) => {
      const w = parseFloat(set.weight);
      const r = parseFloat(set.reps);
      if (!isNaN(w) && !isNaN(r) && w > 0 && r > 0) {
        const est = calculate1RM(w, r);
        if (est > max1RM) max1RM = est;
      }
    });
    return max1RM;
  }, [localExercise, isCardio]);

  // Saving handlers
  const handleSave = (markCompleted = null) => {
    if (!localExercise) return;

    const hasFilledSets = localExercise.sets.some(
      (set) =>
        String(set.reps || "").trim() !== "" &&
        String(set.weight || "").trim() !== ""
    );

    const isCompleted =
      typeof markCompleted === "boolean" ? markCompleted : hasFilledSets;

    onSave({
      ...localExercise,
      completed: isCompleted,
    });
    onClose();
  };

  if (!isOpen || !localExercise) return null;

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
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                {localExercise.name}
              </h3>
              {localExercise.completed && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={12} />
                  Done
                </span>
              )}
            </div>
            {localExercise.target && (
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Target: {localExercise.target}
              </p>
            )}
          </div>
          <button
            aria-label="Close modal"
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 1RM Highlight Banner */}
        {bestSet1RM > 0 && !isCardio && (
          <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 text-white p-3 rounded-xl mb-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Flame className="text-amber-400 animate-pulse" size={18} />
              <div>
                <span className="text-xs text-gray-300 block">Calculated 1RM</span>
                <span className="text-base font-extrabold tracking-tight">
                  {bestSet1RM} kg
                </span>
              </div>
            </div>
            <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-gray-300">
              Epley Standard
            </span>
          </div>
        )}

        {/* Sets Table Header */}
        <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div className="col-span-2 text-center">Set</div>
          <div className="col-span-5">{isCardio ? "Duration" : "Reps"}</div>
          <div className="col-span-4">{isCardio ? "Intensity" : "Weight (kg)"}</div>
          <div className="col-span-1 text-center"></div>
        </div>

        {/* Sets Rows */}
        <div className="space-y-3 mb-4">
          {localExercise.sets.map((set, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 items-center bg-gray-50/70 p-2 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
              {/* Set index */}
              <div className="col-span-2 flex items-center justify-center font-bold text-sm text-gray-700 bg-white rounded-lg py-2 border border-gray-100 shadow-2xs">
                {index + 1}
              </div>

              {/* Reps / Duration */}
              <div className="col-span-5 relative flex items-center">
                <input
                  type={isCardio ? "text" : "number"}
                  inputMode={isCardio ? "text" : "numeric"}
                  className="w-full py-2 px-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  placeholder={isCardio ? "30 min" : "10"}
                  value={set.reps}
                  onChange={(e) => handleSetChange(index, "reps", e.target.value)}
                />
                {!isCardio && (
                  <div className="flex flex-col ml-1 gap-0.5">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleAdjustReps(index, 1)}
                      className="text-[10px] bg-gray-200 hover:bg-gray-300 px-1 py-0.5 rounded leading-none text-gray-700">
                      +
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleAdjustReps(index, -1)}
                      className="text-[10px] bg-gray-200 hover:bg-gray-300 px-1 py-0.5 rounded leading-none text-gray-700">
                      -
                    </button>
                  </div>
                )}
              </div>

              {/* Weight / Intensity */}
              <div className="col-span-4 relative flex items-center">
                <input
                  type={isCardio ? "text" : "number"}
                  inputMode={isCardio ? "text" : "decimal"}
                  step="0.5"
                  className="w-full py-2 px-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  placeholder={isCardio ? "Level 5" : "60"}
                  value={set.weight}
                  onChange={(e) => handleSetChange(index, "weight", e.target.value)}
                />
                {!isCardio && (
                  <div className="flex flex-col ml-1 gap-0.5">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleAdjustWeight(index, 2.5)}
                      className="text-[9px] bg-gray-200 hover:bg-gray-300 px-1 py-0.5 rounded leading-none text-gray-700 font-medium">
                      +2.5
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleAdjustWeight(index, -2.5)}
                      className="text-[9px] bg-gray-200 hover:bg-gray-300 px-1 py-0.5 rounded leading-none text-gray-700 font-medium">
                      -2.5
                    </button>
                  </div>
                )}
              </div>

              {/* Delete button */}
              <div className="col-span-1 flex justify-center">
                {localExercise.sets.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteSet(index)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Delete set">
                    <Trash2 size={16} />
                  </button>
                ) : (
                  <span className="w-4" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Set Button */}
        <button
          type="button"
          onClick={handleAddSet}
          className="w-full py-2.5 px-3 mb-5 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-[0.99] transition">
          <Plus size={16} />
          <span>Add Set</span>
        </button>

        {/* Rest Timer Widget */}
        <div className="bg-gray-50 rounded-2xl p-3.5 mb-5 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Clock size={15} className="text-gray-500" />
              <span>Rest Timer</span>
            </div>

            {timerSeconds > 0 && (
              <span className="text-sm font-black text-gray-900 tracking-wider font-mono">
                {Math.floor(timerSeconds / 60)}:
                {String(timerSeconds % 60).padStart(2, "0")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[60, 90, 120, 180].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => startRestTimer(sec)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                  timerActive && timerTarget === sec
                    ? "bg-gray-900 text-white font-semibold"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}>
                {sec}s
              </button>
            ))}

            {timerSeconds > 0 && (
              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  onClick={toggleTimerPause}
                  className="p-1 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100">
                  {timerActive ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  type="button"
                  onClick={resetTimer}
                  className="p-1 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100">
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            type="button"
            className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 active:scale-[0.98] transition"
            onClick={() => handleSave(false)}>
            Save
          </button>
          <button
            type="button"
            className="flex-1 py-3 px-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:scale-[0.98] transition flex items-center justify-center gap-1.5 shadow-sm"
            onClick={() => handleSave(true)}>
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Complete & Save</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
