import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';
import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config: WebpackConfig) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@babylonjs/core': path.resolve('node_modules/@babylonjs/core'),
        '@babylonjs/loaders': path.resolve('node_modules/@babylonjs/loaders'),
      };
    }
    return config;
  },
  outputFileTracingIncludes: {
    '/_next/static/chunks/**': [
      'node_modules/@babylonjs/core/**/*',
      'node_modules/@babylonjs/loaders/**/*',
    ],
  },
};

export default nextConfig;
