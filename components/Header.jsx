"use client";
import { Settings } from "lucide-react";
import React, { useEffect, useState } from "react";

const Header = ({ workoutsCompleted }) => {
  const [weekNumber, setWeekNumber] = useState(0);

  useEffect(() => {
    // Calculate the current week of the year
    const calculateWeekNumber = () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const diff = now - start;
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const weekNum = Math.floor(diff / oneWeek) + 1;
      setWeekNumber(weekNum);
    };

    calculateWeekNumber();
  }, []);

  // Function to get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return num + "st";
    }
    if (j === 2 && k !== 12) {
      return num + "nd";
    }
    if (j === 3 && k !== 13) {
      return num + "rd";
    }
    return num + "th";
  };

  return (
    <div className="w-full bg-white transition-all duration-300 border-b p-[1rem] z-10 border-gray-200">
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
            {workoutsCompleted} workouts completed
          </p>
        </div>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-all duration-200 active:bg-gray-100 active:scale-95"
          aria-label="Settings">
          {/* Simple gear/settings icon SVG */}
          <Settings color="#9ca3af" />
        </button>
      </div>
    </div>
  );
};

// Default export with sample data
const HeaderWrapper = ({ workoutsCompleted = 43 }) => {
  return <Header workoutsCompleted={workoutsCompleted} />;
};

export default HeaderWrapper;
