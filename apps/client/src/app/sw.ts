import {
  CacheFirst,
  ExpirationPlugin,
  NetworkOnly,
  type PrecacheEntry,
  type RuntimeCaching,
  Serwist,
  type SerwistGlobalConfig,
  type SerwistPlugin,
  StaleWhileRevalidate,
} from 'serwist';

import { isPublicCacheableResponse } from './sw-cache-policy';

interface ServiceWorkerActivateEvent extends Event {
  waitUntil(promise: Promise<unknown>): void;
}

interface DongchimiServiceWorkerGlobalScope extends SerwistGlobalConfig {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  addEventListener(type: 'activate', listener: (event: ServiceWorkerActivateEvent) => void): void;
}

declare const self: DongchimiServiceWorkerGlobalScope;

const DAY_IN_SECONDS = 24 * 60 * 60;
const RUNTIME_CACHE_PREFIX = 'dongchimi-client-runtime-';
const RUNTIME_CACHE_VERSION = 'v1';

const runtimeCacheNames = {
  fonts: `${RUNTIME_CACHE_PREFIX}${RUNTIME_CACHE_VERSION}-fonts`,
  images: `${RUNTIME_CACHE_PREFIX}${RUNTIME_CACHE_VERSION}-images`,
  staticAssets: `${RUNTIME_CACHE_PREFIX}${RUNTIME_CACHE_VERSION}-static-assets`,
} as const;

const publicResponseOnlyPlugin = {
  cacheWillUpdate: ({ response }) => {
    if (!isPublicCacheableResponse(response)) {
      return null;
    }

    return response;
  },
} satisfies SerwistPlugin;

const runtimeCaching = [
  {
    matcher: ({ sameOrigin, url }) => sameOrigin && url.pathname.startsWith('/api/'),
    handler: new NetworkOnly(),
  },
  {
    matcher: ({ sameOrigin, url }) => sameOrigin && url.pathname === '/oauth/callback',
    handler: new NetworkOnly(),
  },
  // Cross-origin requests intentionally bypass Serwist. Registering a
  // NetworkOnly route would make the worker CSP govern those fetches and can
  // block third-party SDKs such as Kakao Maps. Unmatched requests still use the
  // browser network path and are not cached by this service worker.
  {
    matcher: ({ request, sameOrigin }) => sameOrigin && request.mode === 'navigate',
    handler: new NetworkOnly(),
  },
  {
    matcher: ({ sameOrigin, url }) => sameOrigin && url.pathname.startsWith('/_next/static/'),
    handler: new CacheFirst({
      cacheName: runtimeCacheNames.staticAssets,
      plugins: [
        publicResponseOnlyPlugin,
        new ExpirationPlugin({
          maxEntries: 128,
          maxAgeSeconds: 30 * DAY_IN_SECONDS,
          maxAgeFrom: 'last-used',
        }),
      ],
    }),
  },
  {
    matcher: ({ request, sameOrigin }) => sameOrigin && request.destination === 'font',
    handler: new CacheFirst({
      cacheName: runtimeCacheNames.fonts,
      plugins: [
        publicResponseOnlyPlugin,
        new ExpirationPlugin({
          maxEntries: 16,
          maxAgeSeconds: 30 * DAY_IN_SECONDS,
          maxAgeFrom: 'last-used',
        }),
      ],
    }),
  },
  {
    matcher: ({ request, sameOrigin }) => sameOrigin && request.destination === 'image',
    handler: new StaleWhileRevalidate({
      cacheName: runtimeCacheNames.images,
      plugins: [
        publicResponseOnlyPlugin,
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 30 * DAY_IN_SECONDS,
          maxAgeFrom: 'last-used',
        }),
      ],
    }),
  },
] satisfies RuntimeCaching[];

self.addEventListener('activate', (event) => {
  const activeRuntimeCaches = new Set<string>(Object.values(runtimeCacheNames));

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith(RUNTIME_CACHE_PREFIX) && !activeRuntimeCaches.has(cacheName),
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      ),
  );
});

const serwist = new Serwist({
  cacheId: 'dongchimi-client',
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher: ({ request }) => request.destination === 'document',
      },
    ],
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
});

serwist.addEventListeners();
