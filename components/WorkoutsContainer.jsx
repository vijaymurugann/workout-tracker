"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { initialWorkoutData } from "@/const/data";
import { updateWorkoutDataWithCurrentDates } from "@/lib/utils/date-utils";
import { X } from "lucide-react";
import { SlickBottomSheet } from "slick-bottom-sheet";
import WorkoutCard from "./WorkoutCard";

// Sample workout data structure

const WorkoutsContainer = () => {
  // State variables
  const [workoutData, setWorkoutData] = useState(initialWorkoutData);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const animationFrameId = useRef(null);

  // Initialize with the current day of the week and update dates
  useEffect(() => {
    // Update workout data with current week dates
    const updatedWorkoutData =
      updateWorkoutDataWithCurrentDates(initialWorkoutData);
    setWorkoutData(updatedWorkoutData);

    const today = new Date().getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    // Map JavaScript day numbers to our array indices
    // JS: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    // Our array: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
    const dayMapping = {
      0: 6, // Sunday -> index 6
      1: 0, // Monday -> index 0
      2: 1, // Tuesday -> index 1
      3: 2, // Wednesday -> index 2
      4: 3, // Thursday -> index 3
      5: 4, // Friday -> index 4
      6: 5, // Saturday -> index 5
    };

    const dayIndex = dayMapping[today];
    setCurrentDayIndex(dayIndex);
  }, []);

  // Day navigation handlers
  const handleDayChange = (dayIndex) => {
    if (isAnimating || isDragging) return;

    setIsAnimating(true);

    // Immediately set the new day index
    setCurrentDayIndex(dayIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(false);
    setDragOffset(0);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;

    const touchCurrentX = e.touches[0].clientX;
    const diff = touchStartX - touchCurrentX;

    if (Math.abs(diff) > 10 && !isDragging) {
      setIsDragging(true);
    }

    if (isDragging) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        setDragOffset(-diff);
      });
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const threshold = 80; // Minimum swipe distance
    const maxDayIndex = workoutData.days.length - 1;

    if (Math.abs(diff) > threshold) {
      // Determine new day index
      let newDayIndex;
      if (diff > 0) {
        // Swipe left - next day
        newDayIndex = currentDayIndex < maxDayIndex ? currentDayIndex + 1 : 0;
      } else {
        // Swipe right - previous day
        newDayIndex = currentDayIndex > 0 ? currentDayIndex - 1 : maxDayIndex;
      }

      // Set the new day immediately, then clean up drag state
      setCurrentDayIndex(newDayIndex);
    }

    // Always reset drag state
    setIsDragging(false);
    setDragOffset(0);
    setTouchStartX(0);
  };

  // Exercise modal handlers
  const openExerciseModal = useCallback((exercise) => {
    setSelectedExercise({ ...exercise });
    setIsModalOpen(true);
  }, []);

  const closeExerciseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedExercise(null);
  }, []);

  const updateExerciseSet = useCallback(
    (setIndex, field, value) => {
      if (!selectedExercise) return;

      const updatedSets = [...selectedExercise.sets];
      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        [field]: value,
      };

      setSelectedExercise((prev) => ({
        ...prev,
        sets: updatedSets,
      }));
    },
    [selectedExercise]
  );

  const addNewSet = useCallback(() => {
    if (!selectedExercise) return;

    setSelectedExercise((prev) => ({
      ...prev,
      sets: [...prev.sets, { reps: "", weight: "" }],
    }));
  }, [selectedExercise]);

  const handleSaveExercise = useCallback(() => {
    if (!selectedExercise) return;

    // Check if at least one set has both reps and weight filled
    const isCompleted = selectedExercise.sets.some(
      (set) => set.reps.trim() !== "" && set.weight.trim() !== ""
    );

    const updatedExercise = {
      ...selectedExercise,
      completed: isCompleted,
    };

    // Update the workout data
    const updatedWorkoutData = JSON.parse(JSON.stringify(workoutData));
    const currentDay = updatedWorkoutData.days[currentDayIndex];

    if (currentDay.exercises) {
      const exerciseIndex = currentDay.exercises.findIndex(
        (ex) => ex.id === selectedExercise.id
      );
      if (exerciseIndex !== -1) {
        currentDay.exercises[exerciseIndex] = updatedExercise;
      }
    }

    // Log the update (instead of saving to DB)
    console.log("Exercise updated:", updatedExercise);

    // Update state
    setWorkoutData(updatedWorkoutData);
    closeExerciseModal();
  }, [closeExerciseModal, currentDayIndex, selectedExercise, workoutData]);

  // Get current day data
  const currentDay = workoutData.days[currentDayIndex];

  // Calculate completion progress for current day
  const completedExercises =
    currentDay && currentDay.exercises
      ? currentDay.exercises.filter((ex) => ex.completed).length
      : 0;
  const totalExercises =
    currentDay && currentDay.exercises ? currentDay.exercises.length : 0;
  const isFullyCompleted =
    completedExercises === totalExercises && totalExercises > 0;

  // Helper function to get day data by index with wrapping
  const getDayByIndex = useCallback(
    (index) => {
      const totalDays = workoutData.days.length;
      if (index < 0) {
        return workoutData.days[totalDays + index];
      } else if (index >= totalDays) {
        return workoutData.days[index - totalDays];
      }
      return workoutData.days[index];
    },
    [workoutData]
  );

  // Render workout card for a specific day
  const renderWorkoutCardForDay = (dayData, isActive = true) => {
    return (
      <WorkoutCard
        dayData={dayData}
        isActive={isActive}
        openExerciseModal={openExerciseModal}
      />
    );
  };

  const MemoizedExerciseModal = React.memo(function ExerciseModal() {
    if (!selectedExercise) return null;

    // Check if this is a cardio exercise (from Saturday's workout)
    const isCardioExercise = currentDay && currentDay.focus === "Cardio";

    const modalContent = (
      <SlickBottomSheet
        isOpen={isModalOpen}
        onCloseStart={() => {
          closeExerciseModal();
        }}
        className="bg-white rounded-t-2xl overflow-hidden shadow-xl"
        header={
          <div className="flex justify-center py-2">
            <div className="w-10 h-1 rounded-full bg-gray-300"></div>
          </div>
        }
        backdropClassName="backdrop-blur-sm bg-black bg-opacity-10"
        style={{ zIndex: 9999 }}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h3 className="text-lg font-medium">{selectedExercise.name}</h3>
            <button
              className="p-1 text-gray-400 hover:text-gray-600"
              onClick={closeExerciseModal}>
              <X />
            </button>
          </div>

          <div className="grid grid-cols-12 gap-2 mb-2 text-sm text-gray-500 font-medium">
            <div className="col-span-2">Set</div>
            <div className="col-span-5">
              {isCardioExercise ? "Duration" : "Reps"}
            </div>
            <div className="col-span-5">
              {isCardioExercise ? "Intensity" : "Weight (kg)"}
            </div>
          </div>

          {selectedExercise.sets.map((set, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-3">
              <div className="col-span-2 flex items-center justify-center bg-gray-50 rounded-md py-2 text-gray-600 font-medium">
                {index + 1}
              </div>
              <div className="col-span-5">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder={isCardioExercise ? "30 min" : "0"}
                  value={set.reps}
                  onChange={(e) =>
                    updateExerciseSet(index, "reps", e.target.value)
                  }
                />
              </div>
              <div className="col-span-5">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder={isCardioExercise ? "Level 5" : "0"}
                  value={set.weight}
                  onChange={(e) =>
                    updateExerciseSet(index, "weight", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <button
            className="w-full py-2 px-3 mb-4 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            onClick={addNewSet}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            <span className="text-gray-600">Add Set</span>
          </button>

          <button
            className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all duration-200"
            onClick={handleSaveExercise}>
            Save
          </button>
        </div>
      </SlickBottomSheet>
    );

    // Use portal to render modal at document body level
    return typeof document !== "undefined"
      ? createPortal(modalContent, document.body)
      : null;
  });

  return (
    <div className="w-full">
      <div
        className="swipe-container relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        {/* Sliding cards container */}
        <div
          className={`flex duration-300 ease-out ${
            isDragging ? "" : "transition-transform"
          }`}
          style={{
            transform: `translateX(calc(-${
              currentDayIndex * 33.333
            }% + ${dragOffset}px))`,
            width: "300%", // Show 3 cards: previous, current, next
          }}>
          {/* Render all cards but only one is active */}
          {workoutData.days.map((day, index) => (
            <div key={day.id || index} className="w-1/3 flex-shrink-0 px-2">
              <WorkoutCard
                dayData={day}
                isActive={index === currentDayIndex}
                openExerciseModal={openExerciseModal}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Modal - Now rendered via portal at body level */}
      <MemoizedExerciseModal />
    </div>
  );
};

export default WorkoutsContainer;
