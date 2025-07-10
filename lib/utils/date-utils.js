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
