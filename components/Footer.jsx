"use client";
import { usePathname, useRouter } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isProgress = pathname?.startsWith("/progress");
  const isWorkouts = !isProgress;

  const handleTabClick = (tab) => {
    router.push(`/${tab}`);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-30">
      <div className="flex justify-around max-w-md mx-auto">
        <button
          className={`flex flex-col items-center transition-all duration-200 active:scale-95 cursor-pointer ${
            isWorkouts ? "text-black font-semibold" : "text-gray-400"
          }`}
          onClick={() => handleTabClick("workouts")}>
          <span>Workouts</span>
          {isWorkouts && (
            <div className="h-1 w-1 bg-black rounded-full mt-1 transition-all duration-300"></div>
          )}
        </button>

        <button
          className={`flex flex-col items-center transition-all duration-200 active:scale-95 cursor-pointer ${
            isProgress ? "text-black font-semibold" : "text-gray-400"
          }`}
          onClick={() => handleTabClick("progress")}>
          <span>Progress</span>
          {isProgress && (
            <div className="h-1 w-1 bg-black rounded-full mt-1 transition-all duration-300"></div>
          )}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
