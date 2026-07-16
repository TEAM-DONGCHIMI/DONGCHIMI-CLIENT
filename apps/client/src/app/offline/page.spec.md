# Next Route Spec: `offline`

## Metadata

- App: `client`
- Route: `/offline`
- Route path: `apps/client/src/app/offline/page.tsx`
- Domain page: `apps/client/src/domains/pwa/offline/OfflinePage.tsx`
- Jira: DCMCL-28
- Status: Ready

## Purpose

- Serwist가 document navigation에 응답할 수 없을 때 precached fallback으로 제공하는 공개 route입니다.
- route entry는 UI를 소유하지 않고 `OfflinePage` composition만 연결합니다.

## Route

- params: none
- search params: none
- layout: root mobile app shell
- access rule: public; auth redirect 또는 API 요청 없이 정적으로 렌더링

## Composition

- Route entry imports `OfflinePage` from `src/domains/pwa/offline`.
- Route-specific parsing and Next.js concerns stay in `src/app`.
- Domain UI and data hooks stay in `src/domains`.
- Client provider composition stays in `src/app/providers.tsx`.
- service worker fallback points to `/offline`, while the address bar may keep the originally requested document URL.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `/offline` route smoke check at 320px and 375px
- [x] offline navigation fallback smoke check after production build
