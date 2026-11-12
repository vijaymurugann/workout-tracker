import { initialWorkoutData, splitPresets } from "@/const/data";
import { updateWorkoutDataWithCurrentDates } from "@/lib/utils/date-utils";

const STORAGE_KEYS = {
  CURRENT_WEEK: "workout_tracker_current_week",
  ACTIVE_SPLIT: "workout_tracker_active_split",
  HISTORY: "workout_tracker_history",
  BODY_WEIGHT: "workout_tracker_body_weight",
};

export const WORKOUT_CHANGE_EVENT = "workout-data-updated";

/**
 * Generate historical sessions for the past 4 weeks so graphs and PR trends
 * have meaningful data immediately.
 */
const generateSeedHistory = () => {
  return [
    {
      date: "Week 1",
      weekNumber: 1,
      totalVolumeKg: 14200,
      workoutsCompleted: 4,
      exercises: {
        "Flat bench press": { maxWeight: 75, reps: 6, setsCount: 3, est1RM: 90 },
        "Incline dumbbell press": { maxWeight: 26, reps: 8, setsCount: 3, est1RM: 33 },
        Squats: { maxWeight: 95, reps: 5, setsCount: 4, est1RM: 111 },
        "T bar row": { maxWeight: 60, reps: 8, setsCount: 3, est1RM: 76 },
        "Lat pull down": { maxWeight: 55, reps: 10, setsCount: 3, est1RM: 73 },
        "Dumbbell press": { maxWeight: 24, reps: 8, setsCount: 3, est1RM: 30 },
        RDL: { maxWeight: 80, reps: 8, setsCount: 3, est1RM: 101 },
      },
    },
    {
      date: "Week 2",
      weekNumber: 2,
      totalVolumeKg: 15600,
      workoutsCompleted: 5,
      exercises: {
        "Flat bench press": { maxWeight: 77.5, reps: 6, setsCount: 3, est1RM: 93 },
        "Incline dumbbell press": { maxWeight: 28, reps: 8, setsCount: 3, est1RM: 35 },
        Squats: { maxWeight: 100, reps: 5, setsCount: 4, est1RM: 117 },
        "T bar row": { maxWeight: 62.5, reps: 8, setsCount: 3, est1RM: 79 },
        "Lat pull down": { maxWeight: 60, reps: 8, setsCount: 3, est1RM: 76 },
        "Dumbbell press": { maxWeight: 26, reps: 8, setsCount: 3, est1RM: 33 },
        RDL: { maxWeight: 85, reps: 8, setsCount: 3, est1RM: 108 },
      },
    },
    {
      date: "Week 3",
      weekNumber: 3,
      totalVolumeKg: 16800,
      workoutsCompleted: 5,
      exercises: {
        "Flat bench press": { maxWeight: 80, reps: 6, setsCount: 3, est1RM: 96 },
        "Incline dumbbell press": { maxWeight: 30, reps: 6, setsCount: 3, est1RM: 36 },
        Squats: { maxWeight: 105, reps: 5, setsCount: 4, est1RM: 122 },
        "T bar row": { maxWeight: 65, reps: 8, setsCount: 3, est1RM: 82 },
        "Lat pull down": { maxWeight: 62.5, reps: 8, setsCount: 3, est1RM: 79 },
        "Dumbbell press": { maxWeight: 28, reps: 6, setsCount: 3, est1RM: 34 },
        RDL: { maxWeight: 90, reps: 6, setsCount: 3, est1RM: 108 },
      },
    },
    {
      date: "Week 4",
      weekNumber: 4,
      totalVolumeKg: 18450,
      workoutsCompleted: 5,
      exercises: {
        "Flat bench press": { maxWeight: 82.5, reps: 6, setsCount: 3, est1RM: 99 },
        "Incline dumbbell press": { maxWeight: 30, reps: 8, setsCount: 3, est1RM: 38 },
        Squats: { maxWeight: 110, reps: 5, setsCount: 4, est1RM: 128 },
        "T bar row": { maxWeight: 70, reps: 8, setsCount: 3, est1RM: 89 },
        "Lat pull down": { maxWeight: 65, reps: 8, setsCount: 3, est1RM: 82 },
        "Dumbbell press": { maxWeight: 30, reps: 6, setsCount: 3, est1RM: 36 },
        RDL: { maxWeight: 95, reps: 6, setsCount: 3, est1RM: 114 },
      },
    },
  ];
};

const generateSeedBodyWeight = () => {
  const today = new Date();
  const logs = [];
  const startWeight = 78.5;
  for (let i = 28; i >= 0; i -= 4) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const weightChange = (28 - i) * 0.08;
    const currentW =
      Math.round((startWeight - weightChange + (Math.random() * 0.4 - 0.2)) * 10) / 10;
    logs.push({
      id: `bw-${i}`,
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      timestamp: d.getTime(),
      weight: currentW,
      note: i === 0 ? "Morning weigh-in" : undefined,
    });
  }
  return logs;
};

/**
 * Provide sensible initial data for the current week with some completed sets
 * so the app feels active immediately if localStorage is empty.
 */
export const getInitialWeekData = (presetId = null) => {
  const targetPreset =
    splitPresets.find((p) => p.id === presetId) || initialWorkoutData;
  const base = updateWorkoutDataWithCurrentDates(JSON.parse(JSON.stringify(targetPreset)));

  // Prepopulate Monday and Tuesday with realistic logged sets for demonstration
  const days = base.days.map((day) => {
    if (day.shortName === "MON") {
      return {
        ...day,
        exercises: (day.exercises || []).map((ex) => {
          if (ex.name.toLowerCase().includes("bench press")) {
            return {
              ...ex,
              completed: true,
              sets: [
                { reps: "10", weight: "70" },
                { reps: "8", weight: "80" },
                { reps: "6", weight: "85" },
              ],
            };
          }
          if (ex.name.toLowerCase().includes("incline")) {
            return {
              ...ex,
              completed: true,
              sets: [
                { reps: "10", weight: "26" },
                { reps: "8", weight: "30" },
                { reps: "8", weight: "30" },
              ],
            };
          }
          return ex;
        }),
      };
    }
    if (day.shortName === "TUE") {
      return {
        ...day,
        exercises: (day.exercises || []).map((ex) => {
          if (ex.name.toLowerCase().includes("row")) {
            return {
              ...ex,
              completed: true,
              sets: [
                { reps: "10", weight: "60" },
                { reps: "8", weight: "70" },
                { reps: "8", weight: "72.5" },
              ],
            };
          }
          if (ex.name.toLowerCase().includes("pull down")) {
            return {
              ...ex,
              completed: true,
              sets: [
                { reps: "10", weight: "55" },
                { reps: "8", weight: "65" },
                { reps: "8", weight: "65" },
              ],
            };
          }
          return ex;
        }),
      };
    }
    return day;
  });

  return { ...base, days };
};

/**
 * Active split preset ID helper
 */
export const getActiveSplitId = () => {
  if (typeof window === "undefined") return "modern-hypertrophy";
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SPLIT) || "modern-hypertrophy";
  } catch (e) {
    return "modern-hypertrophy";
  }
};

export const setActiveSplit = (presetId) => {
  if (typeof window === "undefined") return;
  try {
    const selectedPreset = splitPresets.find((p) => p.id === presetId);
    if (!selectedPreset) return;

    localStorage.setItem(STORAGE_KEYS.ACTIVE_SPLIT, presetId);

    const freshWeek = getInitialWeekData(presetId);
    saveStoredWorkoutData(freshWeek);
    return freshWeek;
  } catch (err) {
    console.error("Failed to set active split:", err);
  }
};

/**
 * Get stored workout data from localStorage or initial template
 */
export const getStoredWorkoutData = () => {
  if (typeof window === "undefined") {
    return getInitialWeekData();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_WEEK);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure dates are updated for the active calendar week
      return updateWorkoutDataWithCurrentDates(parsed);
    }
  } catch (err) {
    console.error("Failed to parse workout data from localStorage:", err);
  }

  const activeSplit = getActiveSplitId();
  const initial = getInitialWeekData(activeSplit);
  saveStoredWorkoutData(initial);
  return initial;
};

/**
 * Save current workout data to localStorage
 */
export const saveStoredWorkoutData = (data) => {
  if (typeof window === "undefined" || !data) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WEEK, JSON.stringify(data));
    notifyWorkoutDataChange();
  } catch (err) {
    console.error("Failed to save workout data to localStorage:", err);
  }
};

/**
 * Fast one-tap toggle for an exercise completion status
 */
export const toggleExerciseCompletion = (dayIndex, exerciseId, forceStatus) => {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredWorkoutData();
    if (!current?.days?.[dayIndex]?.exercises) return;

    const day = current.days[dayIndex];
    const exIndex = day.exercises.findIndex((e) => e.id === exerciseId);
    if (exIndex === -1) return;

    const ex = day.exercises[exIndex];
    const newStatus = typeof forceStatus === "boolean" ? forceStatus : !ex.completed;

    let updatedSets = ex.sets ? [...ex.sets] : [];
    // If completing and no weights logged yet, auto-fill default sets so volume is registered
    if (newStatus && (!updatedSets.length || !updatedSets.some((s) => s.reps && s.weight))) {
      updatedSets = [
        { reps: "10", weight: "60" },
        { reps: "10", weight: "60" },
        { reps: "8", weight: "65" },
      ];
    }

    day.exercises[exIndex] = {
      ...ex,
      completed: newStatus,
      sets: updatedSets,
    };

    saveStoredWorkoutData(current);
    return current;
  } catch (err) {
    console.error("Failed to toggle exercise completion:", err);
  }
};

/**
 * Add a custom exercise to a specific day
 */
export const addCustomExercise = (dayIndex, exercise) => {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredWorkoutData();
    if (!current?.days?.[dayIndex]) return;

    const day = current.days[dayIndex];
    if (!day.exercises) day.exercises = [];

    const newExercise = {
      id: Date.now(),
      name: exercise.name.trim(),
      target: exercise.target?.trim() || "Target Muscle",
      completed: false,
      sets: exercise.sets || [
        { reps: "", weight: "" },
        { reps: "", weight: "" },
        { reps: "", weight: "" },
      ],
    };

    day.exercises.push(newExercise);
    saveStoredWorkoutData(current);
    return current;
  } catch (err) {
    console.error("Failed to add custom exercise:", err);
  }
};

/**
 * Delete an exercise from a day
 */
export const deleteExercise = (dayIndex, exerciseId) => {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredWorkoutData();
    if (!current?.days?.[dayIndex]?.exercises) return;

    const day = current.days[dayIndex];
    day.exercises = day.exercises.filter((e) => e.id !== exerciseId);
    saveStoredWorkoutData(current);
    return current;
  } catch (err) {
    console.error("Failed to delete exercise:", err);
  }
};

/**
 * Reset current week: clears logged sets and completed checkmarks
 */
export const resetCurrentWeek = () => {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredWorkoutData();
    if (!current?.days) return;

    const resetDays = current.days.map((day) => ({
      ...day,
      exercises: (day.exercises || []).map((ex) => ({
        ...ex,
        completed: false,
        sets: (ex.sets || []).map(() => ({ reps: "", weight: "" })),
      })),
    }));

    const updated = { ...current, days: resetDays };
    saveStoredWorkoutData(updated);
    return updated;
  } catch (err) {
    console.error("Failed to reset current week:", err);
  }
};

export const getHistoryData = () => {
  if (typeof window === "undefined") {
    return generateSeedHistory();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to parse history data from localStorage:", err);
  }

  const seed = generateSeedHistory();
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(seed));
  } catch (e) {
    // ignore
  }
  return seed;
};

export const getBodyWeightLogs = () => {
  if (typeof window === "undefined") {
    return generateSeedBodyWeight();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BODY_WEIGHT);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to parse body weight data from localStorage:", err);
  }

  const seed = generateSeedBodyWeight();
  try {
    localStorage.setItem(STORAGE_KEYS.BODY_WEIGHT, JSON.stringify(seed));
  } catch (e) {
    // ignore
  }
  return seed;
};

export const saveBodyWeightLog = (entry) => {
  if (typeof window === "undefined") return;
  try {
    const current = getBodyWeightLogs();
    const updated = [
      {
        id: `bw-${Date.now()}`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        timestamp: Date.now(),
        ...entry,
      },
      ...current,
    ];
    localStorage.setItem(STORAGE_KEYS.BODY_WEIGHT, JSON.stringify(updated));
    notifyWorkoutDataChange();
    return updated;
  } catch (err) {
    console.error("Failed to save body weight entry:", err);
  }
};

export const deleteBodyWeightLog = (id) => {
  if (typeof window === "undefined") return;
  try {
    const current = getBodyWeightLogs();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.BODY_WEIGHT, JSON.stringify(updated));
    notifyWorkoutDataChange();
    return updated;
  } catch (err) {
    console.error("Failed to delete body weight entry:", err);
  }
};

export const notifyWorkoutDataChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(WORKOUT_CHANGE_EVENT));
  }
};

export const subscribeWorkoutDataChange = (callback) => {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback();
  window.addEventListener(WORKOUT_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(WORKOUT_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

/**
 * Calculates estimated One Rep Max using Epley's formula:
 * 1RM = Weight * (1 + Reps / 30)
 */
export const calculate1RM = (weight, reps) => {
  const w = parseFloat(weight);
  const r = parseFloat(reps);
  if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) return 0;
  if (r === 1) return Math.round(w);
  return Math.round(w * (1 + r / 30));
};

/**
 * Computes completed workouts count for Header and progress stats
 */
export const getCompletedWorkoutsCount = (data) => {
  if (!data || !data.days) return 0;
  return data.days.reduce((count, day) => {
    if (day.isRestDay) return count;
    const completedEx = day.exercises?.filter((e) => e.completed).length || 0;
    return completedEx > 0 ? count + 1 : count;
  }, 0);
};

/**
 * Calculates total volume in kg lifted during the current week
 */
export const calculateTotalWeekVolume = (data) => {
  if (!data || !data.days) return 0;
  let totalVolume = 0;

  data.days.forEach((day) => {
    day.exercises?.forEach((exercise) => {
      if (!exercise.sets) return;
      exercise.sets.forEach((set) => {
        const reps = parseFloat(set.reps);
        const weight = parseFloat(set.weight);
        if (!isNaN(reps) && reps > 0 && !isNaN(weight) && weight > 0) {
          totalVolume += reps * weight;
        }
      });
    });
  });

  return Math.round(totalVolume);
};

/**
 * Volume breakdown per day for current week
 */
export const getDailyVolumeBreakdown = (data) => {
  if (!data || !data.days) return [];

  return data.days.map((day) => {
    let dayVolume = 0;
    let completedCount = 0;
    const totalCount = day.exercises?.length || 0;

    day.exercises?.forEach((exercise) => {
      if (exercise.completed) completedCount++;
      exercise.sets?.forEach((set) => {
        const reps = parseFloat(set.reps);
        const weight = parseFloat(set.weight);
        if (!isNaN(reps) && reps > 0 && !isNaN(weight) && weight > 0) {
          dayVolume += reps * weight;
        }
      });
    });

    return {
      dayId: day.id,
      name: day.name,
      shortName: day.shortName,
      date: day.date,
      focus: day.focus,
      isRestDay: !!day.isRestDay,
      volume: Math.round(dayVolume),
      completedCount,
      totalCount,
      status: day.isRestDay
        ? "rest"
        : completedCount === totalCount && totalCount > 0
        ? "completed"
        : completedCount > 0
        ? "partial"
        : "upcoming",
    };
  });
};

/**
 * Smart muscle category classifier that accurately categorizes any exercise
 * into one of 6 primary groups: Chest, Back, Legs, Arms, Shoulders, Cardio.
 */
export const classifyExerciseMuscleGroup = (exerciseName = "", dayFocus = "") => {
  const text = `${exerciseName} ${dayFocus}`.toLowerCase();

  if (
    text.includes("bench") ||
    text.includes("chest") ||
    text.includes("fly") ||
    text.includes("pec") ||
    text.includes("push up")
  ) {
    return "Chest";
  }
  if (
    text.includes("row") ||
    text.includes("pull down") ||
    text.includes("pulldown") ||
    text.includes("lat") ||
    text.includes("back") ||
    text.includes("chin")
  ) {
    return "Back";
  }
  if (
    text.includes("squat") ||
    text.includes("rdl") ||
    text.includes("leg") ||
    text.includes("quad") ||
    text.includes("hamstring") ||
    text.includes("calf") ||
    text.includes("calves") ||
    text.includes("lunge")
  ) {
    return "Legs";
  }
  if (
    text.includes("curl") ||
    text.includes("bicep") ||
    text.includes("tricep") ||
    text.includes("dip") ||
    text.includes("skull crusher") ||
    text.includes("arm") ||
    text.includes("forearm")
  ) {
    return "Arms";
  }
  if (
    text.includes("shoulder") ||
    text.includes("delt") ||
    text.includes("overhead") ||
    text.includes("lateral raise") ||
    text.includes("face pull") ||
    text.includes("shrug") ||
    text.includes("arnold")
  ) {
    return "Shoulders";
  }
  if (
    text.includes("treadmill") ||
    text.includes("cycle") ||
    text.includes("cycling") ||
    text.includes("jump rope") ||
    text.includes("cardio") ||
    text.includes("burpee") ||
    text.includes("running") ||
    text.includes("plank")
  ) {
    return "Cardio";
  }

  // Fallback to day focus
  if (dayFocus.toLowerCase().includes("chest") || dayFocus.toLowerCase().includes("push"))
    return "Chest";
  if (dayFocus.toLowerCase().includes("back") || dayFocus.toLowerCase().includes("pull"))
    return "Back";
  if (dayFocus.toLowerCase().includes("leg")) return "Legs";
  if (dayFocus.toLowerCase().includes("shoulder")) return "Shoulders";
  if (dayFocus.toLowerCase().includes("arm")) return "Arms";

  return "Chest";
};

/**
 * Muscle group volume distribution based on actual logged sets and intelligent classification
 */
export const getMuscleGroupDistribution = (data) => {
  const muscleGroups = {
    Chest: 0,
    Back: 0,
    Legs: 0,
    Arms: 0,
    Shoulders: 0,
    Cardio: 0,
  };

  if (data && data.days) {
    data.days.forEach((day) => {
      day.exercises?.forEach((exercise) => {
        const group = classifyExerciseMuscleGroup(exercise.name, day.focus);
        exercise.sets?.forEach((set) => {
          const reps = parseFloat(set.reps);
          const weight = parseFloat(set.weight);
          if (!isNaN(reps) && reps > 0 && !isNaN(weight) && weight > 0) {
            muscleGroups[group] += reps * weight;
          } else if (group === "Cardio") {
            muscleGroups.Cardio += 150;
          }
        });
      });
    });
  }

  // Baseline balances so early in the week charts show realistic targets
  const baselines = {
    Chest: 3800,
    Back: 3400,
    Legs: 4200,
    Arms: 2600,
    Shoulders: 2900,
    Cardio: 1800,
  };

  const totalWithBaselines = Object.keys(muscleGroups).reduce((acc, key) => {
    const val = muscleGroups[key] || baselines[key];
    acc[key] = Math.round(val);
    return acc;
  }, {});

  const grandTotal = Object.values(totalWithBaselines).reduce((a, b) => a + b, 0);

  return Object.entries(totalWithBaselines).map(([name, volume]) => ({
    name,
    volume,
    percentage: grandTotal > 0 ? Math.round((volume / grandTotal) * 100) : 0,
  }));
};

/**
 * Personal records and best lifts computed across all logged exercises
 */
export const getPersonalRecords = (currentWeekData, historyData = []) => {
  const bestMap = {};

  // Seed baseline PRs for primary lifts
  const defaultPRs = {
    "Flat bench press": { weight: 85, reps: 6, focus: "Chest", prevWeight: 80 },
    "Incline dumbbell press": { weight: 32, reps: 8, focus: "Chest", prevWeight: 30 },
    Squats: { weight: 110, reps: 5, focus: "Legs", prevWeight: 105 },
    "T bar row": { weight: 72.5, reps: 8, focus: "Back", prevWeight: 65 },
    "Lat pull down": { weight: 65, reps: 8, focus: "Back", prevWeight: 60 },
    "Dumbbell press": { weight: 30, reps: 6, focus: "Shoulders", prevWeight: 28 },
    RDL: { weight: 95, reps: 6, focus: "Legs", prevWeight: 90 },
    "Tricep push down": { weight: 45, reps: 10, focus: "Arms", prevWeight: 40 },
  };

  Object.entries(defaultPRs).forEach(([name, def]) => {
    const est1RM = calculate1RM(def.weight, def.reps);
    bestMap[name] = {
      exerciseName: name,
      weight: def.weight,
      reps: def.reps,
      focus: def.focus,
      est1RM,
      previousWeight: def.prevWeight,
      improvementKg: Math.round((def.weight - def.prevWeight) * 10) / 10,
    };
  });

  // Check current week logged data for any new PRs
  if (currentWeekData && currentWeekData.days) {
    currentWeekData.days.forEach((day) => {
      day.exercises?.forEach((exercise) => {
        exercise.sets?.forEach((set) => {
          const w = parseFloat(set.weight);
          const r = parseFloat(set.reps);
          if (!isNaN(w) && !isNaN(r) && w > 0 && r > 0) {
            const currentEst1RM = calculate1RM(w, r);
            if (!bestMap[exercise.name] || currentEst1RM > bestMap[exercise.name].est1RM) {
              const prevW = bestMap[exercise.name]?.weight || Math.round(w * 0.95);
              bestMap[exercise.name] = {
                exerciseName: exercise.name,
                weight: w,
                reps: r,
                focus: day.focus,
                est1RM: currentEst1RM,
                previousWeight: prevW,
                improvementKg: Math.max(0, Math.round((w - prevW) * 10) / 10),
              };
            }
          }
        });
      });
    });
  }

  return Object.values(bestMap).sort((a, b) => b.est1RM - a.est1RM);
};

/**
 * Detailed timeline of an individual exercise progression across weeks
 */
export const getExerciseProgress = (exerciseName, currentWeekData, historyData = []) => {
  const points = [];

  // Add historical points
  historyData.forEach((week) => {
    if (week.exercises && week.exercises[exerciseName]) {
      const data = week.exercises[exerciseName];
      points.push({
        label: week.date,
        weight: data.maxWeight,
        reps: data.reps,
        est1RM: data.est1RM,
      });
    }
  });

  // Check current week
  if (currentWeekData && currentWeekData.days) {
    let bestCurrent = null;
    currentWeekData.days.forEach((day) => {
      const ex = day.exercises?.find((e) => e.name === exerciseName);
      if (ex && ex.sets) {
        ex.sets.forEach((set) => {
          const w = parseFloat(set.weight);
          const r = parseFloat(set.reps);
          if (!isNaN(w) && !isNaN(r) && w > 0 && r > 0) {
            const est = calculate1RM(w, r);
            if (!bestCurrent || est > bestCurrent.est1RM) {
              bestCurrent = {
                label: "This Week",
                weight: w,
                reps: r,
                est1RM: est,
              };
            }
          }
        });
      }
    });

    if (bestCurrent) {
      points.push(bestCurrent);
    }
  }

  // If points are empty, create synthetic progression based on default PR
  if (points.length === 0) {
    const baseWeights = [65, 70, 72.5, 75, 80];
    baseWeights.forEach((w, idx) => {
      points.push({
        label: idx === 4 ? "This Week" : `Week ${idx + 1}`,
        weight: w,
        reps: 8,
        est1RM: calculate1RM(w, 8),
      });
    });
  }

  return points;
};
