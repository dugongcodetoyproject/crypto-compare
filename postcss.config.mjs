/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "kimchi-compare.vercel.app",
          },
        ],
        destination: "https://www.kimpcoin.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
