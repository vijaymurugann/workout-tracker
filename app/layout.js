import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const viewport = {
  themeColor: "#ffffff",
};

export const metadata = {
  title: "Workout Tracker",
  description: "Track your workouts efficiently.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Workout Tracker",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body className="font-sans antialiased">
        <Header workoutsCompleted={0} />
        <main className="flex justify-center min-h-screen bg-white">
          <div className="w-full max-w-lg">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
