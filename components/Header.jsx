"use client";
import React, { useEffect, useState } from "react";
import { calculateWeekNumber, getOrdinalSuffix } from "@/lib/utils/date-utils";
import {
  getStoredWorkoutData,
  getCompletedWorkoutsCount,
  subscribeWorkoutDataChange,
} from "@/lib/workout-storage";

const Header = ({ workoutsCompleted: initialWorkoutsCompleted = 0 }) => {
  const [weekNumber, setWeekNumber] = useState(0);
  const [completedCount, setCompletedCount] = useState(initialWorkoutsCompleted);

  useEffect(() => {
    setWeekNumber(calculateWeekNumber());

    const updateCount = () => {
      const data = getStoredWorkoutData();
      const count = getCompletedWorkoutsCount(data);
      setCompletedCount(count);
    };

    updateCount();
    const unsubscribe = subscribeWorkoutDataChange(updateCount);
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full sticky top-0 left-0 right-0 bg-white transition-all duration-300 p-[1rem] z-10 border-b-[1px] border-[#f3f4f6] mb-2">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="leading-tight tracking-tight">
            <span className="text-[1.5em] font-extrabold text-gray-900">
              {getOrdinalSuffix(weekNumber)}
            </span>{" "}
            <span className="text-[1.5em] font-medium text-gray-400">
              Week of the year
            </span>
          </h1>
          <p className="text-md font-medium text-[#10b981] mt-1">
            Done {completedCount} workouts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
