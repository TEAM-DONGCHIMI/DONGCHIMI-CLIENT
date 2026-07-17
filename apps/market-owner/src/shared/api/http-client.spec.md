# Market Owner HTTP Authentication Spec

## Metadata

- Jira: DCMSM-114
- Owner: `apps/market-owner/src/shared/api/http-client.ts`
- Status: Implemented

## Purpose

- 보호 API의 access token 만료를 refresh token으로 복구합니다.
- 인증이 확정적으로 무효한 경우에만 저장된 로그인 힌트와 메모리 access token을 제거합니다.
- 브라우저 JavaScript는 HttpOnly refresh token을 직접 읽거나 저장하지 않습니다.

## Behavior

- 보호 API의 최초 `401`은 error code와 관계없이 refresh 대상입니다.
- refresh 성공 시 새 access token을 메모리에 저장하고 원 요청을 한 번 재시도합니다.
- 재시도 응답이 `401/UNAUTHORIZED` 또는 `403/FORBIDDEN`이면 인증 세션을 제거합니다.
- 최초 `403/FORBIDDEN`은 refresh하지 않고 인증 세션을 제거합니다.
- 도메인별 403 error code는 인증 세션을 유지합니다.
- 로그인, 회원가입, refresh처럼 `skipRefresh`를 지정한 요청은 자동 refresh하지 않습니다.
- 같은 JavaScript 실행 컨텍스트에서 동시에 발생한 refresh 요청은 진행 중인 Promise 하나를 공유합니다.
- 같은 origin의 여러 탭과 창에서 발생한 refresh 요청은 Web Locks로 직렬화해 회전 token 경쟁을 방지합니다.
- Web Locks를 지원하지 않는 환경에서는 현재 JavaScript 실행 컨텍스트의 Promise 공유만 적용합니다.

## Refresh Failure

- refresh API의 `401 MISSING_REFRESH_TOKEN` 또는 `401 INVALID_REFRESH_TOKEN`은 인증 세션을 제거합니다.
- refresh API의 network, timeout, `5xx` 오류는 인증 세션을 제거하지 않고 호출자에게 전달합니다.
- 앱 bootstrap 중 refresh 실패 처리와 보호 route 이동 정책은 `useAuthBootstrap`과 `ProtectedRoute`가 담당합니다.

## Storage

- access token은 Zustand 메모리에만 저장합니다.
- `localStorage` 또는 `sessionStorage`에는 `account`, `isLoggedIn`, `marketId` 로그인 힌트만 저장합니다.
- refresh token은 backend가 설정한 HttpOnly cookie로만 관리합니다.

## Verification

- [x] HTTP client auth refresh unit test
- [x] lint
- [x] typecheck
- [x] build
