import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Workout Tracker",
  description: "Track your workouts efficiently.",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Workout Tracker",
    // You can add startup images here if needed, e.g.:
    // startupImage: [
    //   '/icons/apple-touch-startup-image-750x1334.png',
    //   { url: '/icons/apple-touch-startup-image-1536x2048.png', media: '(device-width: 768px) and (device-height: 1024px)' },
    // ],
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
