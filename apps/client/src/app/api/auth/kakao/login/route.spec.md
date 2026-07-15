# Kakao Login Route Handler Spec

## Metadata

- Jira: DCMCL-17
- Route: `POST /api/auth/kakao/login`
- Upstream: `POST /v1/users/login/oauth2/kakao`
- Status: Implemented

## Purpose

- 브라우저와 동치미 백엔드 사이의 인증 BFF 경계를 제공합니다.
- 카카오 인가 코드를 백엔드로 전달하고 token을 client JavaScript에 노출하지 않습니다.

## Contract

- request: `{ code: string }`
- success response: `{ success, code, message }`
- upstream access token: `access_token` HttpOnly cookie로 변환
- upstream refresh cookie: 브라우저에 HttpOnly cookie로 전달
- backend base URL: server-only `API_BASE_URL`

## Cookie Policy

- `access_token`: `HttpOnly`, production `Secure`, `SameSite=Lax`, `Path=/`
- `refreshToken`: 백엔드 속성을 유지하되 BFF refresh route에서 사용할 수 있도록 Path를 `/api/auth/token/refresh`로 변경
- client component는 두 token을 읽거나 저장하지 않습니다.

## Error

- 잘못된 JSON 또는 빈 code는 `400 INVALID_INPUT`으로 응답합니다.
- 백엔드 오류 status와 error body는 client에 전달합니다.
- 성공 응답에 access token 또는 refresh cookie가 없으면 `502 OAUTH_TOKEN_MISSING`으로 응답합니다.

## Verification

- [ ] Route Handler integration test
- [ ] client login mutation integration test
- [ ] lint
- [ ] typecheck
- [ ] build
