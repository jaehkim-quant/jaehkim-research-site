/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/methodology", destination: "/about", permanent: true },
      { source: "/evidence", destination: "/about", permanent: true },
      { source: "/categories", destination: "/research", permanent: true },
    ];
  },
};

module.exports = nextConfig;
