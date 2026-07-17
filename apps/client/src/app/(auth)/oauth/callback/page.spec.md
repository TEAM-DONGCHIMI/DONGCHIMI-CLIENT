# OAuth Callback Route Spec

## Metadata

- Jira: DCMCL-17, DCMCL-38
- Route: `/oauth/callback`
- Domain page: `src/domains/auth/oauth-callback/OAuthCallbackPage.tsx`
- Status: Implemented

## Purpose

- 카카오 OAuth redirect를 인증 도메인 콜백 화면에 연결합니다.

## Route

- params: 없음
- search params: `code`, `state`, `error`
- route group: `(auth)`
- layout: root layout
- access rule: 인증 전 접근 가능한 OAuth callback

## Composition

- route entry는 `OAuthCallbackPage`를 Suspense로 감싸 `useSearchParams()`의 client rendering 경계를 제공합니다.
- Suspense fallback과 domain pending 상태는 같은 `OAuthCallbackLoading`을 사용해 가시 문구 없는 중앙 Lottie loading을 유지합니다.
- OAuth 상태와 API 호출은 domain page와 mutation hook이 담당합니다.
- 로그인 성공 후 이동 경로는 callback query가 아니라 login BFF 응답의 검증된 `redirectTo`를 사용합니다.

## Loading Fallback

- `OAuthCallbackLoading`은 `64px × 64px` spinner Lottie를 viewport 중앙에 표시합니다.
- Lottie client chunk를 불러오는 동안이나 chunk/player load/render 오류가 발생하면 같은 영역의 CSS spinner로 격리합니다.
- reduced-motion에서는 보이지 않는 첫 Lottie 프레임 대신 정지한 CSS spinner를 유지합니다.
- loading animation 오류는 OAuth mutation과 성공 redirect를 중단하지 않습니다.
- 화면에 문구를 노출하지 않고 visually hidden live status만 유지합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client test`
- [x] `pnpm --filter client build`
- [x] route smoke check: `/oauth/callback` Lottie/WASM 200 및 가시 문구 미노출
