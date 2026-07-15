import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withSentryConfig } from '@sentry/nextjs';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withVanillaExtract = createVanillaExtractPlugin();
const isSentrySourceMapUploadEnabled = Boolean(process.env.SENTRY_AUTH_TOKEN);

const nextConfig = {
  transpilePackages: ['@dongchimi/design-system'],
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.woff2$/i,
      type: 'asset/resource',
      generator: isServer
        ? {
            emit: false,
          }
        : undefined,
    });
    config.module.rules.push({
      // Use a function (not a RegExp) for `test` here. Next.js scans
      // `module.rules` for any rule whose `test` is a RegExp matching
      // '.svg' to detect "custom SVG handling" (e.g. @svgr/webpack) and,
      // when found, strips `svg` out of its own built-in next-image-loader
      // rule entirely (see next/dist/build/webpack-config.js, `customSvgRule`).
      // That would break plain `import x from '*.svg'` used with next/image
      // everywhere else in the app. Keeping `test` as a function avoids
      // tripping that `instanceof RegExp` check while still matching the
      // same files.
      test: (resourcePath) => /\.svg$/i.test(resourcePath),
      type: 'asset/resource',
      issuer: /\.css\.ts$/,
    });

    return config;
  },
};

export default withSentryConfig(withVanillaExtract(nextConfig), {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  telemetry: false,
  sourcemaps: {
    disable: !isSentrySourceMapUploadEnabled,
  },
});
