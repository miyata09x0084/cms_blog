/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  optimizeFonts: true,
  async redirects() {
    return [
      {
        source: '/category/:slug',
        destination: '/post?category=:slug',
        permanent: true,
      },
    ];
  },
};
