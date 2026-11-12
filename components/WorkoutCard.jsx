"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Dumbbell,
  Sparkles,
  Flame,
  Check,
  Heart,
  Moon,
  Droplets,
  Activity,
  Layers,
} from "lucide-react";
import { calculate1RM } from "@/lib/workout-storage";

const WorkoutCard = React.memo(function WorkoutCard({
  dayData,
  dayIndex,
  isActive,
  openExerciseModal,
  onToggleExercise,
  onAddExercise,
  onDeleteExercise,
  onMarkAllComplete,
}) {
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [newExTarget, setNewExTarget] = useState("");

  if (!dayData) return null;

  const exercises = dayData.exercises || [];
  const completedCount = exercises.filter((ex) => ex.completed).length;
  const totalCount = exercises.length;
  const isFullyCompleted = completedCount === totalCount && totalCount > 0;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Day total volume lifted
  const dayVolumeKg = React.useMemo(() => {
    let vol = 0;
    exercises.forEach((ex) => {
      ex.sets?.forEach((s) => {
        const r = parseFloat(s.reps);
        const w = parseFloat(s.weight);
        if (!isNaN(r) && r > 0 && !isNaN(w) && w > 0) {
          vol += r * w;
        }
      });
    });
    return Math.round(vol);
  }, [exercises]);

  const handleCreateExercise = (e) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    if (onAddExercise) {
      onAddExercise(dayIndex, {
        name: newExName.trim(),
        target: newExTarget.trim() || dayData.focus,
      });
    }

    setNewExName("");
    setNewExTarget("");
    setIsAddingExercise(false);
  };

  // Rest day card
  if (dayData.isRestDay) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden transition-all duration-300 mb-4">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 p-6 border-b border-emerald-100/50">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles size={13} />
              Active Recovery
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {dayData.date} · {dayData.shortName}
            </span>
          </div>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
            {dayData.focus || "Rest & Rebuild"}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
            Muscles grow during recovery, not in the gym. Prioritize high-protein
            nutrition, deep hydration, and restorative sleep today.
          </p>
        </div>

        {/* Recovery checklist */}
        <div className="p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Optimal Recovery Routine
          </h4>

          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Moon size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">
                  7-9h Sleep
                </span>
                <span className="text-[10px] text-gray-500">Cellular repair</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Droplets size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">
                  3L Water
                </span>
                <span className="text-[10px] text-gray-500">Hydrate tissue</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Activity size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">
                  Light Walk
                </span>
                <span className="text-[10px] text-gray-500">20-30 min mobility</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                <Heart size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">
                  High Protein
                </span>
                <span className="text-[10px] text-gray-500">1.6-2.2g / kg body</span>
              </div>
            </div>
          </div>

          {/* Quick add optional workout */}
          <button
            type="button"
            onClick={() => setIsAddingExercise(true)}
            className="w-full py-2.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition flex items-center justify-center gap-1.5">
            <Plus size={14} />
            <span>Want to train? Add an exercise</span>
          </button>

          {isAddingExercise && (
            <form onSubmit={handleCreateExercise} className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="text"
                placeholder="Exercise name (e.g. 20 min Light Cardio)"
                className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg mb-2 focus:ring-1 focus:ring-gray-900"
                value={newExName}
                onChange={(e) => setNewExName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingExercise(false)}
                  className="py-1.5 px-3 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Regular workout day card
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 mb-4">
      {/* Day Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="flex justify-between items-start mb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {dayData.focus}
              </h2>
              {isFullyCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={12} />
                  Complete
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-gray-400 mt-0.5">
              {dayData.date} · {dayData.shortName}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-gray-900">
              {completedCount}/{totalCount} Done
            </span>
            {dayVolumeKg > 0 && (
              <span className="text-[11px] text-gray-400 block font-medium">
                {dayVolumeKg.toLocaleString()} kg lifted
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isFullyCompleted ? "bg-emerald-500" : "bg-gray-900"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header Action Row */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100/60">
          <button
            type="button"
            onClick={() => setIsAddingExercise((prev) => !prev)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black py-1 px-2 rounded-lg hover:bg-gray-100 transition">
            <Plus size={14} />
            <span>Add Exercise</span>
          </button>

          {exercises.length > 0 && (
            <button
              type="button"
              onClick={() => onMarkAllComplete && onMarkAllComplete(dayIndex, !isFullyCompleted)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 py-1 px-2 rounded-lg hover:bg-gray-100 transition">
              {isFullyCompleted ? "Mark Incomplete" : "Mark All Done"}
            </button>
          )}
        </div>

        {/* Inline Add Exercise Form */}
        {isAddingExercise && (
          <form
            onSubmit={handleCreateExercise}
            className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="space-y-2 mb-2">
              <input
                type="text"
                placeholder="Exercise name (e.g. Incline Cable Fly)"
                className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                value={newExName}
                onChange={(e) => setNewExName(e.target.value)}
                autoFocus
              />
              <input
                type="text"
                placeholder="Target muscle (e.g. Upper Chest)"
                className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                value={newExTarget}
                onChange={(e) => setNewExTarget(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition">
                Add Exercise
              </button>
              <button
                type="button"
                onClick={() => setIsAddingExercise(false)}
                className="py-1.5 px-3 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Exercises List */}
      <div className="p-4">
        <div className="flex flex-col gap-2.5">
          {exercises.map((exercise) => {
            // Find best set summary
            const completedSets = (exercise.sets || []).filter(
              (s) => String(s.reps || "").trim() !== "" && String(s.weight || "").trim() !== ""
            );
            const topSet = completedSets.reduce((best, cur) => {
              const curW = parseFloat(cur.weight) || 0;
              const bestW = parseFloat(best?.weight) || 0;
              return curW >= bestW ? cur : best;
            }, null);

            return (
              <div
                key={exercise.id}
                className={`group p-3 border rounded-xl flex items-center justify-between transition-all duration-200 ${
                  exercise.completed
                    ? "bg-gray-50/50 border-gray-200/80"
                    : "bg-white border-gray-100 hover:border-gray-200 shadow-2xs hover:shadow-xs"
                }`}>
                {/* Exercise Info - Click opens modal */}
                <div
                  className="flex-1 cursor-pointer pr-3"
                  onClick={() => openExerciseModal(exercise)}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-sm tracking-tight ${
                        exercise.completed
                          ? "text-gray-900"
                          : "text-gray-800"
                      }`}>
                      {exercise.name}
                    </span>
                    {exercise.target && (
                      <span className="text-[10px] text-gray-400 font-medium">
                        · {exercise.target}
                      </span>
                    )}
                  </div>

                  {/* Sets / Volume subtitle */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    {exercise.completed && topSet ? (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <span>
                          {exercise.sets.length} sets logged • Top: {topSet.weight} kg × {topSet.reps}
                        </span>
                        {calculate1RM(topSet.weight, topSet.reps) > 0 && (
                          <span className="text-gray-400 font-normal">
                            (1RM: {calculate1RM(topSet.weight, topSet.reps)}kg)
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">
                        {exercise.sets ? `${exercise.sets.length} sets planned` : "Tap to log sets"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right controls: Delete + One-tap Checkmark */}
                <div className="flex items-center gap-2">
                  {/* Delete button (shows on hover or active) */}
                  <button
                    type="button"
                    title="Remove exercise"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteExercise) onDeleteExercise(dayIndex, exercise.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-opacity">
                    <Trash2 size={15} />
                  </button>

                  {/* Fast toggle checkbox */}
                  <button
                    type="button"
                    aria-label={`Toggle ${exercise.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleExercise) onToggleExercise(dayIndex, exercise.id);
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                      exercise.completed
                        ? "bg-gray-900 text-white shadow-2xs"
                        : "border-2 border-gray-200 hover:border-gray-400 text-transparent"
                    }`}>
                    <Check size={14} strokeWidth={3} className={exercise.completed ? "text-white" : "opacity-0"} />
                  </button>
                </div>
              </div>
            );
          })}

          {exercises.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-xs">
              No exercises logged for today yet.
              <button
                type="button"
                onClick={() => setIsAddingExercise(true)}
                className="text-gray-900 font-bold ml-1 underline">
                Add one now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default WorkoutCard;
