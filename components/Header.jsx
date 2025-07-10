"use client";
import { Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { calculateWeekNumber, getOrdinalSuffix } from "@/lib/utils/date-utils";

const Header = ({ workoutsCompleted }) => {
  const [weekNumber, setWeekNumber] = useState(0);

  useEffect(() => {
    setWeekNumber(calculateWeekNumber());
  }, []);

  return (
    <div className="w-full bg-white transition-all duration-300 p-[1rem] z-10 border-b-[1px] border-[#f3f4f6] mb-2">
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
            Done {workoutsCompleted} workouts
          </p>
        </div>
        <a
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-all duration-200 active:bg-gray-100 active:scale-95"
          aria-label="Settings"
          href="/settings" >
          <Settings color="#9ca3af" />
        </a>
      </div>
    </div>
  );
};

export default Header;
