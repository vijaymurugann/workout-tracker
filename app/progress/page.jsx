import ProgressContainer from "@/components/ProgressContainer";

export const metadata = {
  title: "Progress · Workout Tracker",
  description: "Track your workout consistency, volume lifted, personal records, and body composition.",
};

export default function ProgressPage() {
  return (
    <main className="m-auto">
      <div className="px-4 py-2">
        <ProgressContainer />
      </div>
    </main>
  );
}
