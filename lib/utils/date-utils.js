/**
 * Calculate the current ISO week number of the year
 * @returns {number} The current week number (1-indexed)
 */
export const calculateWeekNumber = () => {
  const now = new Date();
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const firstDayOfWeek = firstDayOfYear.getDay();
  const daysPassed = Math.floor((now - firstDayOfYear) / (24 * 60 * 60 * 1000));

  // For ISO weeks (Monday start)
  return Math.ceil(
    (daysPassed + (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1)) / 7
  );
};

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 * @param {number} num - The number to get the ordinal suffix for
 * @returns {string} The number with its ordinal suffix
 */
export const getOrdinalSuffix = (num) => {
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

/**
 * Get the current week's dates starting from Monday
 * @returns {Array<string>} Array of formatted dates for the current week
 */
export const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate days to subtract to get to Monday (start of week)
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;

  // Get Monday of current week
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToMonday);

  const weekDates = [];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate dates for Monday through Sunday
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);

    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();

    weekDates.push(`${month} ${day}`);
  }

  return weekDates;
};

/**
 * Update workout data with current week dates
 * @param {Object} workoutData - The workout data object to update
 * @returns {Object} Updated workout data with current week dates
 */
export const updateWorkoutDataWithCurrentDates = (workoutData) => {
  const currentWeekDates = getCurrentWeekDates();

  return {
    ...workoutData,
    days: workoutData.days.map((day, index) => ({
      ...day,
      date: currentWeekDates[index],
    })),
  };
};
