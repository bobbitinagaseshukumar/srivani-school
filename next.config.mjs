/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['172.30.198.71', '192.168.0.0/16', '10.0.0.0/8', '172.16.0.0/12'],
  serverExternalPackages: ['mongoose']
};

export default nextConfig;
