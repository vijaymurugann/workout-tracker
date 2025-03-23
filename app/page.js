import Header from "@/components/Header";
import WorkoutsContainer from "@/components/WorkoutsContainer";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <main className="m-auto">
      <Header workoutsCompleted={92} />
      <div className="px-4 py-2">
        <WorkoutsContainer />
      </div>
      <Footer />
    </main>
  );
}
