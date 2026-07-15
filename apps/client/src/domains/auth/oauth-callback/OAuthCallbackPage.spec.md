# OAuth Callback Page Spec

## Metadata

- Jira: DCMCL-17, DCMCL-22
- Route: `/oauth/callback`
- Owner: `apps/client/src/domains/auth/oauth-callback`
- Status: Implemented

## Purpose

- 카카오가 전달한 authorization code와 `state`를 동치미 로그인 BFF로 한 번만 전송합니다.
- 로그인 성공 시 token을 직접 저장하지 않고 `/markets`로 이동합니다.

## Scope

- `code`, `state`, `error` search param 처리
- 카카오 로그인 mutation의 loading, success, error 상태 안내
- 동일 code의 Strict Mode 재실행 및 새로고침 재전송 방지
- HttpOnly cookie 기반 로그인 성공과 replace navigation

## Out Of Scope

- access token과 refresh token 직접 접근 또는 저장
- access token 재발급 이후의 전체 session 복구와 route 접근 제어
- callback 화면의 별도 디자인 시안

## Routing And Access

- route path: `/oauth/callback`
- search params: `code`, `state`, `error`
- access rule: 카카오 인증 redirect를 통해 진입
- after action navigation: 성공 시 `/markets`, 실패 시 `/login` 링크 제공

## States

- loading: 로그인 정보를 확인하고 있다는 live region을 표시합니다.
- error: 인증 취소, callback 정보 누락, 정규화된 로그인 오류를 안내합니다.
- success: BFF가 인증 token을 HttpOnly cookie로 설정한 뒤 `/markets`로 replace 이동합니다.

## Accessibility

- 상태 메시지는 `aria-live="polite"`를 사용합니다.
- 오류 메시지는 `role="alert"`를 사용합니다.
- 실패 시 키보드로 접근 가능한 로그인 화면 링크를 제공합니다.

## Error Boundary

- callback page는 백엔드/BFF error code를 직접 분기하지 않습니다.
- 인증 API helper가 `KakaoLoginError`로 정규화한 사용자 메시지만 렌더링합니다.
- provider callback 오류와 callback parameter 누락 메시지는 auth domain model에서 결정합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client test`
- [x] `pnpm --filter client build`
- [x] browser route: `/oauth/callback`
