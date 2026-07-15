# OAuth Callback Route Spec

## Metadata

- Jira: DCMCL-17
- Route: `/oauth/callback`
- Domain page: `src/domains/auth/oauth-callback/OAuthCallbackPage.tsx`
- Status: Implemented

## Purpose

- 카카오 OAuth redirect를 인증 도메인 콜백 화면에 연결합니다.

## Route

- params: 없음
- search params: `code`, `error`
- route group: `(auth)`
- layout: root layout
- access rule: 인증 전 접근 가능한 OAuth callback

## Composition

- route entry는 `OAuthCallbackPage`를 Suspense로 감싸 `useSearchParams()`의 client rendering 경계를 제공합니다.
- OAuth 상태와 API 호출은 domain page와 mutation hook이 담당합니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
- [ ] route smoke check: `/oauth/callback`
