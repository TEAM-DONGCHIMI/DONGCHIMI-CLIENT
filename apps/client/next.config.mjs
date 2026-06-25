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
