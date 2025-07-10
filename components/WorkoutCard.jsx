import React from "react";

const WorkoutCard = React.memo(function WorkoutCard({
  dayData,
  isActive,
  openExerciseModal,
}) {
  if (!dayData) return null;

  const dayCompletedExercises = dayData.exercises
    ? dayData.exercises.filter((ex) => ex.completed).length
    : 0;
  const dayTotalExercises = dayData.exercises ? dayData.exercises.length : 0;
  const dayIsFullyCompleted =
    dayCompletedExercises === dayTotalExercises && dayTotalExercises > 0;

  // Rest day card
  if (dayData.isRestDay) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border-l-4 border-emerald-500 overflow-hidden transition-all duration-300 mb-4">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {dayData.focus}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {dayData.date} · {dayData.shortName}
          </p>

          <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500">
            <span>Stretch</span>
            <span>Hydrate</span>
            <span>Rest</span>
          </div>
        </div>
      </div>
    );
  }

  // Regular workout day card
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border-l-4 border-gray-900 overflow-hidden transition-all duration-300 mb-4">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {dayData.focus}
            </h2>
            <p className="text-sm text-gray-500">
              {dayData.date} · {dayData.shortName}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {dayCompletedExercises}/{dayTotalExercises}
            {dayIsFullyCompleted && (
              <span className="inline-flex ml-1 text-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-2">
          {dayData.exercises &&
            dayData.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`p-3 border border-gray-100 rounded-lg flex justify-between items-center transition-all duration-200 ${
                  isActive
                    ? "cursor-pointer hover:bg-gray-50"
                    : "pointer-events-none"
                }`}
                onClick={
                  isActive ? () => openExerciseModal(exercise) : undefined
                }>
                <span className="font-medium text-gray-800">
                  {exercise.name}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    exercise.completed
                      ? "bg-gray-900 text-white"
                      : "border border-gray-200"
                  }`}>
                  {exercise.completed && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
});

export default WorkoutCard;
