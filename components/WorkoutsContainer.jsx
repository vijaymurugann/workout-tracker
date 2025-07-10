"use client";

import React, { useState, useEffect } from "react";
import { initialWorkoutData } from "@/const/data";
import { updateWorkoutDataWithCurrentDates } from "@/lib/utils/date-utils";
import { Cross, X } from "lucide-react";
// Sample workout data structure

const WorkoutsContainer = () => {
  // State variables
  const [workoutData, setWorkoutData] = useState(initialWorkoutData);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [translateValue, setTranslateValue] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (isAnimating) return;

    const direction = dayIndex > currentDayIndex ? "left" : "right";
    setIsAnimating(true);

    // Determine slide direction
    const slideOffset = direction === "left" ? -20 : 20;
    setTranslateValue(slideOffset);

    // Wait a bit to allow animation to start
    setTimeout(() => {
      setCurrentDayIndex(dayIndex);
      setTranslateValue(0);

      // End the animation state after the transition completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 50);
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStartX) return;

    const touchCurrentX = e.touches[0].clientX;
    const diff = touchStartX - touchCurrentX;

    // Prevent default for significant horizontal swipes
    if (Math.abs(diff) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const threshold = 80; // Minimum swipe distance
    const maxDayIndex = workoutData.days.length - 1; // Get actual number of days

    if (diff > threshold) {
      // Swipe left - next day
      const nextDay = currentDayIndex < maxDayIndex ? currentDayIndex + 1 : 0;
      handleDayChange(nextDay);
    } else if (diff < -threshold) {
      // Swipe right - previous day
      const prevDay = currentDayIndex > 0 ? currentDayIndex - 1 : maxDayIndex;
      handleDayChange(prevDay);
    }

    // Reset touch start value
    setTouchStartX(0);
  };

  // Exercise modal handlers
  const openExerciseModal = (exercise) => {
    setSelectedExercise({ ...exercise });
    setIsModalOpen(true);
  };

  const closeExerciseModal = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
  };

  const updateExerciseSet = (setIndex, field, value) => {
    if (!selectedExercise) return;

    const updatedSets = [...selectedExercise.sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: value,
    };

    setSelectedExercise({
      ...selectedExercise,
      sets: updatedSets,
    });
  };

  const addNewSet = () => {
    if (!selectedExercise) return;

    setSelectedExercise({
      ...selectedExercise,
      sets: [...selectedExercise.sets, { reps: "", weight: "" }],
    });
  };

  const handleSaveExercise = () => {
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
  };

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

  // Render the workout card based on day type
  const renderWorkoutCard = () => {
    if (!currentDay) return null;

    // Rest day card
    if (currentDay.isRestDay) {
      return (
        <div className="w-full bg-white rounded-xl shadow-sm border-l-4 border-emerald-500 overflow-hidden transition-all duration-300 mb-4">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {currentDay.focus}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {currentDay.date} · {currentDay.shortName}
            </p>
           
            <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500">
              <span>Stretch</span>
              <span>Hydrate</span>
              <span>Rest</span>
            </div>
          </div>
        </div>
      );
    }

    // Regular workout day card
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border-l-4 border-gray-900 overflow-hidden transition-all duration-300 mb-4">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDay.focus}
              </h2>
              <p className="text-sm text-gray-500">
                {currentDay.date} · {currentDay.shortName}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {completedExercises}/{totalExercises}
              {isFullyCompleted && (
                <span className="inline-flex ml-1 text-emerald-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col gap-2">
            {currentDay.exercises &&
              currentDay.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="p-3 border border-gray-100 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-all duration-200"
                  onClick={() => openExerciseModal(exercise)}>
                  <span className="font-medium text-gray-800">
                    {exercise.name}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      exercise.completed
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200"
                    }`}>
                    {exercise.completed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  // Exercise modal component
  const ExerciseModal = () => {
    if (!isModalOpen || !selectedExercise) return null;

    // Check if this is a cardio exercise (from Saturday's workout)
    const isCardioExercise = currentDay && currentDay.focus === "Cardio";

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-10  flex items-end justify-center z-50 animate-fadeIn"
        onClick={closeExerciseModal}>
        <div
          className="bg-white w-full max-w-md rounded-t-2xl p-4 animate-slideUp"
          onClick={(e) => e.stopPropagation()}>
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
      </div>
    );
  };

  return (
    <div className="w-full">
      <div
        className="swipe-container relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        // Day Content with Animation
      >
        <div
          className="day-content transition-all duration-300 ease-in-out"
          style={{
            transform: `translateX(${translateValue}px)`,
            opacity: isAnimating ? 0.7 : 1,
          }}>
          {renderWorkoutCard()}
        </div>

        {/* Exercise Modal */}
        <ExerciseModal />
      </div>
    </div>
  );
};

export default WorkoutsContainer;
