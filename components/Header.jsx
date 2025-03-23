"use client"
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
    <div className="w-full bg-white px-6 py-5 transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="leading-tight tracking-tight">
            <span className="text-4xl font-semibold text-gray-900">
              {getOrdinalSuffix(weekNumber)}
            </span>{" "}
            <span className="text-4xl font-normal text-gray-400">
              Week of the year
            </span>
          </h1>
          <p className="text-2xl font-medium text-emerald-500 mt-1">
            {workoutsCompleted} workouts completed
          </p>
        </div>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-all duration-200 active:bg-gray-100 active:scale-95"
          aria-label="Settings">
          {/* Simple gear/settings icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
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
