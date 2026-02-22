/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://0.0.0.0:3000",
    "http://192.168.0.12:3000",
  ],
};

module.exports = nextConfig;