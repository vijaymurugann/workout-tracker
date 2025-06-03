import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  // You can add more PWA options here if needed
})(nextConfig);
