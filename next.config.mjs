/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.together.ai" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/images/**" },
      { pathname: "/user-content/**" },
    ],
  },
};
export default nextConfig;
