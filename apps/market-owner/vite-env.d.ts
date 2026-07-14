/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_API_SERVER_BASE_URL?: string;
  readonly VITE_PUBLIC_S3_BASE_URL?: string;
  readonly VITE_DEV_ACCESS_TOKEN?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  readonly VITE_SENTRY_RELEASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
