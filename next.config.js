/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kupcvxpbfclpysnvpycc.supabase.co',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
