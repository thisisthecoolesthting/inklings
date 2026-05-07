/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.together.ai" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  experimental: { typedRoutes: false },
};
export default nextConfig;
