import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? 'local',
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  initialScope: {
    tags: {
      app: 'client',
      runtime: 'edge',
    },
  },
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
});
