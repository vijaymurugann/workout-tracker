import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Workout Tracker",
  description: "Track your workouts efficiently.",
  manifest: "/manifest.json",
  themeColor: "#000000",
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
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="flex justify-center min-h-screen bg-white">
          <div className="w-full max-w-lg">{children}</div>
        </main>
      </body>
    </html>
  );
}
