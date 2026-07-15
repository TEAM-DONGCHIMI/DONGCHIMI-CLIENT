# Browser API Authentication Retry Spec

## Metadata

- Jira: DCMCL-17
- Owner: `apps/client/src/shared/api/browser-client.ts`
- Status: Implemented

## Purpose

- 브라우저 BFF 요청이 `401`을 반환하면 token refresh Route Handler를 호출합니다.
- refresh 성공 후 실패한 원 요청을 한 번만 재시도합니다.
- 브라우저 JavaScript는 access token과 refresh token을 직접 읽거나 저장하지 않습니다.

## Behavior

- `401`이 아닌 응답은 refresh하지 않습니다.
- 최초 `401` 응답에만 `POST /api/auth/token/refresh`를 호출합니다.
- refresh 성공 시 원 요청을 한 번 재시도합니다.
- 재시도 응답이 다시 `401`이어도 추가 refresh를 수행하지 않습니다.
- 로그인과 refresh를 포함한 `/api/auth/*` 요청은 `401`이어도 refresh하지 않습니다.
- 동시에 여러 요청이 `401`을 반환하면 진행 중인 refresh 요청 하나를 공유합니다.
- refresh 실패 시 최초 `401`을 유지하고 원 요청을 재시도하지 않습니다.

## Retry Policy

- Ky의 일반 network/status retry는 비활성화합니다.
- 인증 refresh가 성공한 경우에만 Ky의 강제 retry를 최대 한 번 사용합니다.

## Verification

- [x] browser API integration test
- [x] lint
- [ ] typecheck
- [ ] build
