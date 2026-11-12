"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Flame,
  Dumbbell,
  TrendingUp,
  Award,
  Calendar,
  Activity,
  Trophy,
  Scale,
  RefreshCw,
} from "lucide-react";
import StatCard from "@/components/progress/StatCard";
import WeeklyTracker from "@/components/progress/WeeklyTracker";
import VolumeChart from "@/components/progress/VolumeChart";
import MuscleDistribution from "@/components/progress/MuscleDistribution";
import PRShowcase from "@/components/progress/PRShowcase";
import ExerciseDeepDive from "@/components/progress/ExerciseDeepDive";
import BodyWeightTracker from "@/components/progress/BodyWeightTracker";
import {
  getStoredWorkoutData,
  getHistoryData,
  getBodyWeightLogs,
  saveBodyWeightLog,
  deleteBodyWeightLog,
  calculateTotalWeekVolume,
  getDailyVolumeBreakdown,
  getMuscleGroupDistribution,
  getPersonalRecords,
  getExerciseProgress,
  subscribeWorkoutDataChange,
} from "@/lib/workout-storage";

export default function ProgressContainer() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "prs" | "body"
  const [workoutData, setWorkoutData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [bodyWeightLogs, setBodyWeightLogs] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("Flat bench press");

  // Load data on mount and subscribe to updates
  useEffect(() => {
    const loadAllData = () => {
      const stored = getStoredWorkoutData();
      const history = getHistoryData();
      const bw = getBodyWeightLogs();

      setWorkoutData(stored);
      setHistoryData(history);
      setBodyWeightLogs(bw);
    };

    loadAllData();
    const unsubscribe = subscribeWorkoutDataChange(loadAllData);
    return () => unsubscribe();
  }, []);

  // Computed metrics
  const totalVolume = useMemo(() => {
    return calculateTotalWeekVolume(workoutData);
  }, [workoutData]);

  const dailyVolumeBreakdown = useMemo(() => {
    return getDailyVolumeBreakdown(workoutData);
  }, [workoutData]);

  const muscleDistribution = useMemo(() => {
    return getMuscleGroupDistribution(workoutData);
  }, [workoutData]);

  const personalRecords = useMemo(() => {
    return getPersonalRecords(workoutData, historyData);
  }, [workoutData, historyData]);

  const allExerciseNames = useMemo(() => {
    if (!workoutData || !workoutData.days) return ["Flat bench press", "Squats", "T bar row"];
    const names = new Set();
    workoutData.days.forEach((day) => {
      day.exercises?.forEach((ex) => names.add(ex.name));
    });
    return Array.from(names);
  }, [workoutData]);

  const currentExerciseProgress = useMemo(() => {
    return getExerciseProgress(selectedExercise, workoutData, historyData);
  }, [selectedExercise, workoutData, historyData]);

  const completedDaysCount = useMemo(() => {
    return dailyVolumeBreakdown.filter((d) => d.status === "completed").length;
  }, [dailyVolumeBreakdown]);

  const targetDaysCount = useMemo(() => {
    return dailyVolumeBreakdown.filter((d) => !d.isRestDay).length || 6;
  }, [dailyVolumeBreakdown]);

  const consistencyRate = useMemo(() => {
    return Math.round((completedDaysCount / targetDaysCount) * 100);
  }, [completedDaysCount, targetDaysCount]);

  // Handlers for body weight
  const handleAddWeightLog = useCallback((entry) => {
    const updated = saveBodyWeightLog(entry);
    if (updated) setBodyWeightLogs(updated);
  }, []);

  const handleDeleteWeightLog = useCallback((id) => {
    const updated = deleteBodyWeightLog(id);
    if (updated) setBodyWeightLogs(updated);
  }, []);

  const handleSelectExerciseFromPR = useCallback((exerciseName) => {
    setSelectedExercise(exerciseName);
    setActiveTab("prs");
  }, []);

  return (
    <div className="w-full pb-28 pt-1">
      {/* Tab Navigation */}
      <div className="flex bg-gray-100/80 p-1 rounded-xl mb-4 border border-gray-200/50">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-white text-gray-900 shadow-xs"
              : "text-gray-500 hover:text-gray-900"
          }`}>
          Overview
        </button>
        <button
          onClick={() => setActiveTab("prs")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "prs"
              ? "bg-white text-gray-900 shadow-xs"
              : "text-gray-500 hover:text-gray-900"
          }`}>
          PRs & Exercises
        </button>
        <button
          onClick={() => setActiveTab("body")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "body"
              ? "bg-white text-gray-900 shadow-xs"
              : "text-gray-500 hover:text-gray-900"
          }`}>
          Body Stats
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard
              title="Streak"
              value="4"
              unit="days"
              subtitle="Keep it rolling!"
              badge="Active"
              badgeType="positive"
              icon={Flame}
            />
            <StatCard
              title="Workouts"
              value={`${completedDaysCount}/${targetDaysCount}`}
              subtitle={`${consistencyRate}% consistency`}
              badge={completedDaysCount >= 2 ? "On Track" : "In Progress"}
              badgeType="positive"
              icon={Award}
            />
            <StatCard
              title="Volume"
              value={totalVolume > 0 ? (totalVolume / 1000).toFixed(1) : "0"}
              unit="k kg"
              subtitle="Lifted this week"
              badge="+8.2%"
              badgeType="positive"
              icon={Dumbbell}
            />
            <StatCard
              title="Consistency"
              value={`${consistencyRate}%`}
              subtitle="Weekly completion"
              badge="Top 15%"
              badgeType="positive"
              icon={TrendingUp}
            />
          </div>

          {/* Weekly Schedule Tracker */}
          <WeeklyTracker days={dailyVolumeBreakdown} />

          {/* Volume Bar Chart */}
          <VolumeChart days={dailyVolumeBreakdown} />

          {/* Muscle Focus Breakdown */}
          <MuscleDistribution distribution={muscleDistribution} />
        </div>
      )}

      {/* PRs & EXERCISES TAB */}
      {activeTab === "prs" && (
        <div className="space-y-4">
          {/* PR Showcase */}
          <PRShowcase
            personalRecords={personalRecords}
            onSelectExercise={handleSelectExerciseFromPR}
          />

          {/* Exercise Progression Graph & History */}
          <ExerciseDeepDive
            exercises={allExerciseNames}
            selectedExercise={selectedExercise}
            onSelectExercise={setSelectedExercise}
            progressData={currentExerciseProgress}
          />
        </div>
      )}

      {/* BODY STATS TAB */}
      {activeTab === "body" && (
        <div className="space-y-4">
          <BodyWeightTracker
            logs={bodyWeightLogs}
            onAddLog={handleAddWeightLog}
            onDeleteLog={handleDeleteWeightLog}
          />

          {/* Body Composition Tips Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs text-gray-600 space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-1.5">
              <Activity size={14} className="text-emerald-600" />
              Tracking Tips
            </h4>
            <p>
              Weigh yourself under consistent conditions — ideally right after
              waking up and using the restroom, before breakfast or water.
            </p>
            <p className="text-gray-400">
              Daily weight fluctuations of 0.5 - 1.5 kg due to water retention and
              carbohydrates are completely normal. Focus on the 4-week trend!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
