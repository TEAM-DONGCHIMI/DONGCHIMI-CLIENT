# Client PWA Spec

## Metadata

- Jira: DCMCL-28, DCMCL-34, DCMCL-42
- Route: app-wide, `/offline`
- Owner: `apps/client`
- Status: Implemented

## Purpose

- 모바일 웹을 Android Chrome과 iOS Safari에서 홈 화면에 설치할 수 있게 합니다.
- 설치 후 standalone 창으로 실행하고, document navigation이 오프라인일 때 generic browser error 대신 최소 안내 화면을 제공합니다.
- service worker가 인증, OAuth, mutation, 사용자별 API 응답을 Cache Storage에 남기지 않도록 안전한 경계를 고정합니다.
- 마트 전단 공유 화면에서 사용자 제스처로 PWA 설치 안내와 브라우저 설치 프롬프트를 연결합니다.

## Source Of Truth

- Next.js PWA guide: https://nextjs.org/docs/app/guides/progressive-web-apps
- Next.js manifest metadata: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
- Serwist Next.js guide: https://serwist.pages.dev/docs/next/getting-started
- PWA installability: https://web.dev/learn/pwa/installation
- Existing client layout: `apps/client/src/app/layout.tsx`
- Existing client global style: `apps/client/src/app/global-style.spec.md`
- Target viewport: mobile web, primary 375px

## Scope

- `src/app/manifest.ts` returns a `MetadataRoute.Manifest` with the following contract:
  - `name`: `동치미`
  - `short_name`: `동치미`
  - `description`: `동치미 모바일 웹`
  - `id`, `start_url`, `scope`: `/`
  - `display`: `standalone`
  - `orientation`: `portrait`
  - `theme_color`: `#FFFFFF` (`common/0`)
  - `background_color`: `#FFFFFF`
  - install icons: 192×192, 512×512, 512×512 maskable
- root metadata keeps `/favicon.svg` and adds the manifest-facing app name, Apple web app metadata, and Apple touch icon.
- root viewport owns the `common/0` (`#FFFFFF`) `themeColor` and device viewport behavior.
- QA-provided 360×360 mobile-web app icon is the source for PNG install icons; the maskable output adds only a same-color safe area and does not redesign the artwork.
- `@serwist/next` compiles `src/app/sw.ts` into generated `public/sw.js` during production builds.
- service worker generation and registration are disabled in development.
- `/offline` is explicitly precached and used only as a document navigation fallback.
- generated service worker files are ignored; source, config, manifest, offline route, and icon assets are committed.
- app root의 `PwaInstallProvider`가 `beforeinstallprompt`를 보관하고 standalone/appinstalled 상태를 동기화합니다.
- `/markets/[slug]` 공유 바텀시트의 `앱으로 전단보기`에서 Figma 설치 안내 시트로 전환합니다.
- 지원 브라우저의 `홈 화면에 추가하기`는 보관한 네이티브 설치 프롬프트를 호출합니다.
- prompt 미지원 또는 이미 설치된 환경에서도 디자인에 없는 앱 내부 후속 안내 view를 추가하지 않습니다.
- 설치 안내 본문은 브라우저 공유 메뉴에서 `홈 화면에 추가`를 선택하는 수동 설치 경로를 함께 설명합니다.
- secondary close action은 `웹으로 계속 이용하기`로 안내하고, 실행하면 설치 안내를 닫아 기존 웹 흐름을 이어갑니다.
- iOS Safari는 프로그래밍 방식 설치 프롬프트를 지원하지 않으므로 동일 바텀시트의 안내 문구로 수동 설치 경로를 제공합니다. 별도 단계형 안내 UI는 추가하지 않습니다.

## Cache Policy

- document navigation: `NetworkOnly`, then the precached `/offline` fallback when no response is available. Authenticated HTML is not persisted in Cache Storage.
- `/_next/static/**`, local fonts, and PWA icons: bounded `CacheFirst` or `StaleWhileRevalidate` caches with expiration rules.
- same-origin images fetched with `GET`: bounded `StaleWhileRevalidate`; failed images remain caller-owned UI state.
- `/api/**` and `/oauth/callback`: `NetworkOnly` and never persisted in Cache Storage.
- cross-origin and non-GET requests: not intercepted by the service worker; they use the browser network path and are not persisted in this PWA's Cache Storage.
- responses marked private/no-store: rejected by the public-response cache policy and never persisted in Cache Storage.
- runtime cache names are versioned; activation removes obsolete runtime caches owned by this PWA, while Serwist removes outdated precache entries.

## Service Worker Lifecycle

- `sw.js` uses `Content-Type: application/javascript; charset=utf-8` and `Cache-Control: no-cache, no-store, must-revalidate`.
- the worker claims clients after activation and does not create an install/reload loop.
- a new deployment may activate the new worker immediately, but page reload remains user/browser driven; the implementation does not force an unconditional reload.
- the offline fallback revision uses the deployment or Git commit SHA when available so the precached document updates between releases.

## Out Of Scope

- Web Push notifications, VAPID keys, notification subscription API
- Background Sync, offline mutation queue, offline product database
- 전단 공유 화면 외의 전역 custom install banner
- App Store / Play Store packaging and native WebView shell
- caching authenticated API data for offline browsing

## Files And Ownership

- `src/app/manifest.ts`: install metadata
- `src/app/layout.tsx`: root metadata and viewport
- `src/app/sw.ts`: service worker routing, caching, and lifecycle
- `src/app/offline/page.tsx`: Next route entry
- `src/domains/pwa/offline/*`: offline UI and page-local retry interaction
- `src/shared/pwa/*`: install prompt lifecycle and app-wide install state
- `src/domains/market/market-products/components/market-share-bottom-sheet/*`: install entry and Figma guide UI
- `next.config.mjs`: Serwist wrapper and `sw.js` response headers
- `tsconfig.json`: service worker typings and generated output exclusion
- `eslint.config.mjs`: generated service worker lint exclusion
- `public/icons/*`: generated install assets

## Accessibility And Responsive

- offline page has one visible `h1`, explanatory text, and a keyboard-accessible retry button.
- retry keeps a visible focus indicator through the design-system `Button`.
- page accounts for mobile safe-area variables and remains readable from 320px through the app shell max width.
- installed app has a useful accessible name from manifest and Apple metadata.

## Verification

- [x] `git diff --check`
- [x] `pnpm install --frozen-lockfile`
- [x] `pnpm format:check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client test`
- [x] `pnpm --filter client build`
- [x] production server exposes valid `/manifest.webmanifest`, `/sw.js`, and install icons
- [x] Chromium parses the manifest and registers one worker at scope `/`
- [x] offline document navigation renders `/offline` after an online warm-up
- [x] `/api/**`, OAuth, and user-specific responses do not appear in Cache Storage
- [x] `/markets/[slug]` share sheet transitions to the Figma install guide
- [x] simulated `beforeinstallprompt` is deferred until the install CTA and invoked once
- [x] prompt-unavailable and installed states do not introduce an additional app-side install view
- [x] install guide describes the browser share-menu path without changing the native prompt CTA
- [x] `웹으로 계속 이용하기` closes the install guide and restores focus to its trigger
- [x] viewport and manifest theme colors use `common/0` (`#FFFFFF`)
- [x] install guide matches `375 x 397` and has no horizontal overflow at 320px
- [ ] Android Chrome and iOS Safari real-device installation smoke test

## Open Questions

- real-device installation requires an HTTPS Preview or Production URL and is recorded separately from local HTTP verification.
- if the existing favicon source fails the maskable safe-zone visual check, a dedicated icon design follow-up is required.
