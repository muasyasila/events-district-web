import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  images: {
    domains: [
      'pdlsocjvuxmqykigxakj.supabase.co',
      'ui-avatars.com',
      'randomuser.me',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pdlsocjvuxmqykigxakj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;