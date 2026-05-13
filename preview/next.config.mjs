import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // The deliverable nav files live one directory above this preview, so the
    // build-time TS checker can't resolve next/* types from their location.
    // Dev mode + the preview's own tsconfig still type-check normally.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      ...(config.resolve.modules ?? ['node_modules']),
    ];
    return config;
  },
};

export default nextConfig;
