"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { initialWorkoutData, splitPresets } from "@/const/data";
import {
  getStoredWorkoutData,
  saveStoredWorkoutData,
  subscribeWorkoutDataChange,
  getActiveSplitId,
  setActiveSplit,
  toggleExerciseCompletion,
  addCustomExercise,
  deleteExercise,
  resetCurrentWeek,
} from "@/lib/workout-storage";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Layers,
  Sparkles,
  Calendar,
  CheckCircle2,
  Moon,
} from "lucide-react";
import WorkoutCard from "./WorkoutCard";
import ExerciseModal from "./ExerciseModal";
import SplitSelectorModal from "./SplitSelectorModal";

const WorkoutsContainer = () => {
  // State variables
  const [workoutData, setWorkoutData] = useState(initialWorkoutData);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [todayIndex, setTodayIndex] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [activeSplitId, setActiveSplitId] = useState("modern-hypertrophy");

  // Touch and drag states
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const animationFrameId = useRef(null);

  // Initialize with the current day of the week and stored data
  useEffect(() => {
    const loadedData = getStoredWorkoutData();
    setWorkoutData(loadedData);
    setActiveSplitId(getActiveSplitId());

    const today = new Date().getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const dayMapping = {
      0: 6, // Sunday -> index 6
      1: 0, // Monday -> index 0
      2: 1, // Tuesday -> index 1
      3: 2, // Wednesday -> index 2
      4: 3, // Thursday -> index 3
      5: 4, // Friday -> index 4
      6: 5, // Saturday -> index 5
    };

    const targetDayIndex = dayMapping[today] ?? 0;
    setTodayIndex(targetDayIndex);
    setCurrentDayIndex(targetDayIndex);

    const unsubscribe = subscribeWorkoutDataChange(() => {
      setWorkoutData(getStoredWorkoutData());
      setActiveSplitId(getActiveSplitId());
    });

    return () => unsubscribe();
  }, []);

  // Keyboard navigation (ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isExerciseModalOpen || isSplitModalOpen) return;
      if (e.key === "ArrowLeft") {
        goToPreviousDay();
      } else if (e.key === "ArrowRight") {
        goToNextDay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentDayIndex, workoutData, isExerciseModalOpen, isSplitModalOpen]);

  // Day navigation handlers
  const handleDayChange = (dayIndex) => {
    if (!workoutData?.days) return;
    const bounded = Math.max(0, Math.min(dayIndex, workoutData.days.length - 1));
    setCurrentDayIndex(bounded);
    setDragOffset(0);
  };

  const goToPreviousDay = () => {
    if (!workoutData?.days) return;
    const newIndex =
      currentDayIndex > 0 ? currentDayIndex - 1 : workoutData.days.length - 1;
    handleDayChange(newIndex);
  };

  const goToNextDay = () => {
    if (!workoutData?.days) return;
    const newIndex =
      currentDayIndex < workoutData.days.length - 1 ? currentDayIndex + 1 : 0;
    handleDayChange(newIndex);
  };

  // Touch event handlers for mobile gestures
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(false);
    setDragOffset(0);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null || touchStartY === null) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartX - currentX;
    const diffY = touchStartY - currentY;

    // Only engage horizontal drag if horizontal motion exceeds vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      if (!isDragging) setIsDragging(true);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        setDragOffset(-diffX);
      });

      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    const threshold = 60; // Minimum swipe distance in px
    const maxDayIndex = (workoutData?.days?.length || 7) - 1;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swiped left -> Next day
        setCurrentDayIndex((prev) => (prev < maxDayIndex ? prev + 1 : 0));
      } else {
        // Swiped right -> Previous day
        setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : maxDayIndex));
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Exercise modal handlers
  const openExerciseModal = useCallback((exercise) => {
    setSelectedExercise(exercise);
    setIsExerciseModalOpen(true);
  }, []);

  const closeExerciseModal = useCallback(() => {
    setIsExerciseModalOpen(false);
    setSelectedExercise(null);
  }, []);

  const handleSaveExercise = useCallback(
    (updatedExercise) => {
      if (!updatedExercise || !workoutData?.days) return;

      const updated = JSON.parse(JSON.stringify(workoutData));
      const currentDay = updated.days[currentDayIndex];

      if (currentDay?.exercises) {
        const exIdx = currentDay.exercises.findIndex(
          (ex) => ex.id === updatedExercise.id
        );
        if (exIdx !== -1) {
          currentDay.exercises[exIdx] = updatedExercise;
        }
      }

      setWorkoutData(updated);
      saveStoredWorkoutData(updated);
      closeExerciseModal();
    },
    [closeExerciseModal, currentDayIndex, workoutData]
  );

  // Fast direct actions
  const handleToggleExercise = useCallback(
    (dayIdx, exerciseId) => {
      toggleExerciseCompletion(dayIdx, exerciseId);
    },
    []
  );

  const handleAddExercise = useCallback(
    (dayIdx, exercise) => {
      addCustomExercise(dayIdx, exercise);
    },
    []
  );

  const handleDeleteExercise = useCallback(
    (dayIdx, exerciseId) => {
      deleteExercise(dayIdx, exerciseId);
    },
    []
  );

  const handleMarkAllComplete = useCallback(
    (dayIdx, status) => {
      if (!workoutData?.days?.[dayIdx]) return;
      const updated = JSON.parse(JSON.stringify(workoutData));
      const day = updated.days[dayIdx];

      day.exercises = (day.exercises || []).map((ex) => {
        let sets = ex.sets || [];
        if (status && (!sets.length || !sets.some((s) => s.reps && s.weight))) {
          sets = [
            { reps: "10", weight: "60" },
            { reps: "10", weight: "60" },
            { reps: "8", weight: "65" },
          ];
        }
        return {
          ...ex,
          completed: status,
          sets,
        };
      });

      setWorkoutData(updated);
      saveStoredWorkoutData(updated);
    },
    [workoutData]
  );

  const handleSelectSplit = useCallback((presetId) => {
    setActiveSplit(presetId);
  }, []);

  const handleResetCurrentWeek = useCallback(() => {
    if (
      window.confirm(
        "Reset all completed workouts for this week? Your exercise list will be preserved."
      )
    ) {
      resetCurrentWeek();
    }
  }, []);

  const days = workoutData?.days || [];
  const currentDay = days[currentDayIndex];
  const activeSplit =
    splitPresets.find((p) => p.id === activeSplitId) || splitPresets[0];

  return (
    <div className="w-full pb-20">
      {/* Top Split & Action Bar */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <button
          type="button"
          onClick={() => setIsSplitModalOpen(true)}
          className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition active:scale-95">
          <Layers size={14} className="text-gray-600" />
          <span className="truncate max-w-[170px]">{activeSplit.name}</span>
          <span className="text-gray-400 text-[10px]">▼</span>
        </button>

        <div className="flex items-center gap-1">
          {currentDayIndex !== todayIndex && (
            <button
              type="button"
              onClick={() => handleDayChange(todayIndex)}
              className="py-1 px-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition active:scale-95">
              Today
            </button>
          )}

          <button
            type="button"
            title="Reset week progress"
            onClick={handleResetCurrentWeek}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition active:scale-95">
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Interactive Sticky Weekday Selector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-xs mb-4">
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const isSelected = idx === currentDayIndex;
            const isToday = idx === todayIndex;
            const completedCount =
              day.exercises?.filter((e) => e.completed).length || 0;
            const totalCount = day.exercises?.length || 0;
            const isCompleted =
              completedCount === totalCount && totalCount > 0;
            const isPartial = completedCount > 0 && !isCompleted;

            // Extract day number from "October 28"
            const dateParts = day.date?.split(" ") || [];
            const dayNum = dateParts[1] || "";

            return (
              <button
                key={day.id || idx}
                type="button"
                onClick={() => handleDayChange(idx)}
                className={`relative flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? "bg-gray-900 text-white shadow-sm"
                    : "hover:bg-gray-50 text-gray-700"
                }`}>
                {/* Weekday abbreviation */}
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isSelected ? "text-gray-300" : "text-gray-400"
                  }`}>
                  {day.shortName}
                </span>

                {/* Day number */}
                <span className="text-sm font-black my-0.5">
                  {dayNum || idx + 1}
                </span>

                {/* Status Dot / Icon */}
                <div className="h-2 flex items-center justify-center mt-0.5">
                  {day.isRestDay ? (
                    <Moon
                      size={8}
                      className={isSelected ? "text-emerald-400" : "text-emerald-600"}
                    />
                  ) : isCompleted ? (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-emerald-400" : "bg-emerald-500"
                      }`}
                    />
                  ) : isPartial ? (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-amber-300" : "bg-amber-400"
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-1 h-1 rounded-full ${
                        isSelected ? "bg-gray-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                {/* Today Indicator Pill */}
                {isToday && (
                  <span
                    className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-emerald-400" : "bg-emerald-500 ring-2 ring-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Carousel Controls Header */}
      <div className="flex items-center justify-between mb-2 px-2 text-xs text-gray-500">
        <button
          type="button"
          onClick={goToPreviousDay}
          className="inline-flex items-center gap-1 font-semibold text-gray-600 hover:text-black py-1 px-2 rounded-lg hover:bg-gray-100 transition active:scale-95">
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <span className="font-bold text-gray-800">
          Day {currentDayIndex + 1} of 7
        </span>

        <button
          type="button"
          onClick={goToNextDay}
          className="inline-flex items-center gap-1 font-semibold text-gray-600 hover:text-black py-1 px-2 rounded-lg hover:bg-gray-100 transition active:scale-95">
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Sliding Cards Container */}
      <div
        className="swipe-container relative overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        <div
          className={`flex ${
            isDragging ? "" : "transition-transform duration-300 ease-out"
          }`}
          style={{
            transform: `translateX(calc(-${
              (currentDayIndex * 100) / (days.length || 7)
            }% + ${dragOffset}px))`,
            width: `${(days.length || 7) * 100}%`,
          }}>
          {days.map((day, index) => (
            <div
              key={day.id || index}
              style={{ width: `${100 / days.length}%` }}
              className="flex-shrink-0 px-1">
              <WorkoutCard
                dayData={day}
                dayIndex={index}
                isActive={index === currentDayIndex}
                openExerciseModal={openExerciseModal}
                onToggleExercise={handleToggleExercise}
                onAddExercise={handleAddExercise}
                onDeleteExercise={handleDeleteExercise}
                onMarkAllComplete={handleMarkAllComplete}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Standalone Exercise Modal (Never remounts during typing) */}
      <ExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={closeExerciseModal}
        exercise={selectedExercise}
        onSave={handleSaveExercise}
        isCardio={currentDay && currentDay.focus === "Cardio"}
      />

      {/* Split Selector Modal */}
      <SplitSelectorModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        currentSplitId={activeSplitId}
        onSelectSplit={handleSelectSplit}
      />
    </div>
  );
};

export default WorkoutsContainer;
