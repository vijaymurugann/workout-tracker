"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Footer = () => {
  const [activeTab, setActiveTab] = useState("workouts");
  const router = useRouter();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Navigation would go here in a full implementation
    // router.push(`/${tab}`);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-10">
      <div className="flex justify-around max-w-md mx-auto">
        <button
          className={`flex flex-col items-center transition-all duration-200 active:scale-95 ${
            activeTab === "workouts"
              ? "text-black font-medium"
              : "text-gray-400"
          }`}
          onClick={() => handleTabClick("workouts")}>
          <span>Workouts</span>
          {activeTab === "workouts" && (
            <div className="h-1 w-1 bg-black rounded-full mt-1 transition-all duration-300"></div>
          )}
        </button>

        <button
          className={`flex flex-col items-center transition-all duration-200 active:scale-95 ${
            activeTab === "progress"
              ? "text-black font-medium"
              : "text-gray-400"
          }`}
          onClick={() => handleTabClick("progress")}>
          <span>Progress</span>
          {activeTab === "progress" && (
            <div className="h-1 w-1 bg-black rounded-full mt-1 transition-all duration-300"></div>
          )}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
