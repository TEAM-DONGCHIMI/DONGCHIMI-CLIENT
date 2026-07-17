import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withSentryConfig } from '@sentry/nextjs';
import withSerwistInit from '@serwist/next';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withVanillaExtract = createVanillaExtractPlugin();
const isSentrySourceMapUploadEnabled = Boolean(process.env.SENTRY_AUTH_TOKEN);
const svgUrlResourceQuery = /^\?url$/;
const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV !== 'production',
  reloadOnOnline: false,
  globPublicPatterns: ['favicon.svg', 'icons/*.png'],
  additionalPrecacheEntries: [
    {
      url: '/offline',
      revision: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? null,
    },
  ],
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  transpilePackages: ['@dongchimi/design-system'],
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Serwist mutates the final asset graph after Next compiles it. Reusing
      // Next's persistent webpack cache can restore CSS with stale asset hashes
      // on a subsequent production build, so production builds stay clean.
      config.cache = false;
    }

    config.module.rules.push({
      test: /\.woff2$/i,
      type: 'asset/resource',
      generator: isServer
        ? {
            emit: false,
          }
        : undefined,
    });

    const nextImageRule = config.module.rules.find(
      (rule) => rule && typeof rule === 'object' && rule.loader === 'next-image-loader',
    );
    const nextImageResourceQuery =
      nextImageRule && typeof nextImageRule === 'object' ? nextImageRule.resourceQuery : undefined;

    if (
      nextImageResourceQuery == null ||
      typeof nextImageResourceQuery !== 'object' ||
      !Array.isArray(nextImageResourceQuery.not)
    ) {
      throw new Error('Next image loader resource query exclusions are unavailable.');
    }

    // `*.svg?url` is an explicit raw-asset request. Without this exclusion,
    // next-image-loader first turns the SVG into a JavaScript module and the
    // asset module rule below emits that module again with an `.svg` suffix.
    nextImageResourceQuery.not.push(svgUrlResourceQuery);

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
      // Vanilla Extract does not emit this CSS-owned asset into Next's
      // development media directory. Inline it in development so the CSS
      // cannot reference a missing file; production keeps the emitted asset.
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: dev ? Number.MAX_SAFE_INTEGER : 0,
        },
      },
      issuer: /\.css\.ts$/,
      resourceQuery: svgUrlResourceQuery,
    });

    config.module.rules.push({
      test: /\.wasm$/i,
      type: 'asset/resource',
    });

    return config;
  },
};

export default withSentryConfig(withSerwist(withVanillaExtract(nextConfig)), {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  telemetry: false,
  sourcemaps: {
    disable: !isSentrySourceMapUploadEnabled,
  },
});
