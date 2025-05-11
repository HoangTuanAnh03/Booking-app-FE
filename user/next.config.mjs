/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "us1.discourse-cdn.com",
      "encrypted-tbn0.gstatic.com",
      "europe1.discourse-cdn.com",
      "i.imgur.com",
    ],
  },
};

export default nextConfig;
