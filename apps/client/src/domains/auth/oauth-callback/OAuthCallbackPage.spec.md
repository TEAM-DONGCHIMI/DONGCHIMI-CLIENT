# OAuth Callback Page Spec

## Metadata

- Jira: DCMCL-17, DCMCL-22, DCMCL-38
- Route: `/oauth/callback`
- Owner: `apps/client/src/domains/auth/oauth-callback`
- Status: Implemented

## Purpose

- 카카오가 전달한 authorization code와 `state`를 동치미 로그인 BFF로 한 번만 전송합니다.
- 로그인 성공 시 token을 직접 저장하지 않고 BFF가 반환한 검증된 `redirectTo`로 이동합니다.

## Scope

- `code`, `state`, `error` search param 처리
- 카카오 로그인 mutation의 loading, success, error 상태 안내
- 동일 code의 Strict Mode 재실행 및 새로고침 재전송 방지
- HttpOnly cookie 기반 로그인 성공과 replace navigation
- BFF 응답의 `redirectTo` 재검증과 `/markets` fallback
- 정상 callback 처리 중 viewport 중앙의 공통 Lottie loading
- 앱 로컬 `.lottie` asset과 번들된 dotLottie WASM runtime
- dynamic chunk loading/error의 CSS spinner 격리

## Out Of Scope

- access token과 refresh token 직접 접근 또는 저장
- access token 재발급 이후의 전체 session 복구와 route 접근 제어
- callback 오류 화면의 별도 디자인 변경

## Routing And Access

- route path: `/oauth/callback`
- search params: `code`, `state`, `error`
- access rule: 카카오 인증 redirect를 통해 진입
- after action navigation: 성공 시 검증된 `/markets` 하위 `redirectTo`, 값이 없거나 안전하지 않으면 `/markets`, 실패 시 `/login` 링크 제공

## States

- loading: 가시 문구 없이 `64px × 64px` spinner Lottie를 중앙에 표시하고, 로그인 확인 상태는 visually hidden live region으로 제공합니다.
- loading fallback: Lottie chunk가 준비 중이거나 실패하거나 player가 `loadError`/`renderError`를 보내면 OAuth 흐름을 유지하며 CSS spinner를 표시합니다.
- reduced motion: autoplay/loop를 끄고 실행 중 설정 변경에도 player를 즉시 pause/resume하며, 빈 첫 프레임 대신 정지한 CSS spinner를 표시합니다.
- error: 인증 취소, callback 정보 누락, 정규화된 로그인 오류를 안내합니다.
- success: BFF가 인증 token을 HttpOnly cookie로 설정한 뒤 검증된 `redirectTo`로 replace 이동합니다.

## Accessibility

- Lottie canvas와 CSS spinner는 `aria-hidden="true"`인 장식 요소입니다.
- 상태 메시지는 visually hidden `role="status"`, `aria-live="polite"`를 사용합니다.
- 오류 메시지는 `role="alert"`를 사용합니다.
- 실패 시 키보드로 접근 가능한 로그인 화면 링크를 제공합니다.

## Error Boundary

- callback page는 백엔드/BFF error code를 직접 분기하지 않습니다.
- 인증 API helper는 공통 HTTP client의 `ApiError`를 그대로 전달합니다.
- auth/validation 오류는 서버 메시지를 사용하고, network/server/unknown 오류는 auth domain의 안전한 fallback 메시지를 렌더링합니다.
- provider callback 오류와 callback parameter 누락 메시지는 auth domain model에서 결정합니다.

## Runtime And Asset

- Lottie source: `public/lottie/spinner.lottie`
- runtime: `@lottiefiles/dotlottie-react`, `@lottiefiles/dotlottie-web`
- WASM: package의 `dotlottie-player.wasm`을 Next Webpack `asset/resource`로 emit하고 `setWasmUrl`에 등록합니다.
- loading player는 `next/dynamic({ ssr: false })`로 callback 전용 chunk에만 포함합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client test`
- [x] `pnpm --filter client build`
- [x] browser route: `/oauth/callback`
