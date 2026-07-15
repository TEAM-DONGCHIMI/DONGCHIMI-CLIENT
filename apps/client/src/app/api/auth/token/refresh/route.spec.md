# Token Refresh Route Handler Spec

## Metadata

- Jira: DCMCL-17
- Route: `POST /api/auth/token/refresh`
- Upstream: `POST /v1/auth/token/refresh`
- Status: Implemented

## Purpose

- 브라우저 JavaScript에 token을 노출하지 않고 HttpOnly refresh cookie로 인증 token을 갱신합니다.
- 갱신 실패 시 브라우저에 만료된 인증 cookie가 남지 않도록 정리합니다.

## Contract

- request body: 없음
- browser request cookie: `refreshToken`
- upstream request cookie: `RefreshToken`
- success response: `{ success, code, message }`
- upstream access token: `access_token` HttpOnly cookie로 변환
- upstream refresh cookie: 안전한 cookie 속성과 BFF refresh route path로 다시 전달

## Cookie Policy

- `access_token`: `HttpOnly`, production `Secure`, `SameSite=Lax`, `Path=/`
- `refreshToken`: `HttpOnly`, production `Secure`, `SameSite=Lax`, `Path=/api/auth/token/refresh`
- upstream cookie의 `Expires`, `Max-Age` 등 수명 속성은 유지합니다.
- client component는 두 token을 읽거나 저장하지 않습니다.

## Error

- refresh cookie가 없으면 `401 REFRESH_TOKEN_NOT_FOUND`로 응답하고 인증 cookie를 삭제합니다.
- 백엔드의 `401 REFRESH_TOKEN_NOT_FOUND`, `401 INVALID_INPUT`, `401 REFRESH_TOKEN_EXPIRED`, `404 USER_NOT_FOUND` status와 error body를 전달하고 인증 cookie를 삭제합니다.
- 성공 응답에 access token 또는 새 refresh cookie가 없으면 `502 REFRESH_TOKEN_RESPONSE_INVALID`로 응답하고 인증 cookie를 삭제합니다.
- 백엔드 연결 또는 응답 처리에 실패하면 `502 REFRESH_UPSTREAM_FAILED`로 응답하고 인증 cookie를 삭제합니다.

## Verification

- [x] Route Handler integration test
- [x] lint
- [ ] typecheck
- [ ] build
