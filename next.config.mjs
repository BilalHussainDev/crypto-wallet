/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "harlequin-decent-vole-965.mypinata.cloud",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
