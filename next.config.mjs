import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack(config) {
    // SVG dosyalarını @svgr/webpack ile işleme
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // LICENSE ve README dosyalarını yoksayma
    config.module.rules.push({
      test: /\.(LICENSE|README\.md)$/,
      type: "asset/source",
    });

    // @ alias'ı ile src klasörüne erişim
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve('./src'),
    };

    return config;
  },
  reactStrictMode: true,
  experimental: {},
};

export default nextConfig;
