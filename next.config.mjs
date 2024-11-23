/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*", // 모든 경로
        destination: "https://kimpcoin.com/:path*", // 새 도메인
        permanent: true, // 301 리디렉션
      },
    ];
  },
};

export default nextConfig;
