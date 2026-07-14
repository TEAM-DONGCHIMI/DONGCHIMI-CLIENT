# OAuth Callback Page Spec

## Metadata

- Jira: DCMCL-17
- Route: `/oauth/callback`
- Owner: `apps/client/src/domains/auth/oauth-callback`
- Status: Implemented

## Purpose

- 카카오가 전달한 authorization code를 동치미 로그인 API로 한 번만 전송합니다.
- 로그인 성공 시 token을 직접 저장하지 않고 `/markets`로 이동합니다.

## Scope

- `code`, `error` search param 처리
- 카카오 로그인 mutation의 loading, success, error 상태 안내
- 동일 code의 Strict Mode 재실행 및 새로고침 재전송 방지
- HttpOnly cookie 기반 로그인 성공과 replace navigation

## Out Of Scope

- access token과 refresh token 직접 접근 또는 저장
- access token 재발급
- callback 화면의 별도 디자인 시안

## Routing And Access

- route path: `/oauth/callback`
- search params: `code`, `error`
- access rule: 카카오 인증 redirect를 통해 진입
- after action navigation: 성공 시 `/markets`, 실패 시 `/login` 링크 제공

## States

- loading: 로그인 정보를 확인하고 있다는 live region을 표시합니다.
- error: 인증 취소, code 누락, API 오류, access token 누락을 구분해 안내합니다.
- success: access token을 저장한 뒤 `/markets`로 replace 이동합니다.

## Accessibility

- 상태 메시지는 `aria-live="polite"`를 사용합니다.
- 오류 메시지는 `role="alert"`를 사용합니다.
- 실패 시 키보드로 접근 가능한 로그인 화면 링크를 제공합니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client test`
- [ ] `pnpm --filter client build`
- [ ] browser route: `/oauth/callback`

## Open Questions

- access token 재발급 endpoint와 앱 초기 session 복구 정책
