# Kakao Login Route Handler Spec

## Metadata

- Jira: DCMCL-17, DCMCL-22
- Route: `POST /api/auth/kakao/login`
- Upstream: `POST /v1/users/login/oauth2/kakao`
- Status: Implemented

## Purpose

- 브라우저와 동치미 백엔드 사이의 인증 BFF 경계를 제공합니다.
- 카카오 인가 코드와 `state`를 검증하고, 검증된 인가 코드만 백엔드로 전달합니다.
- token을 client JavaScript에 노출하지 않습니다.

## Contract

- browser request: `{ code: string, state: string }`
- browser cookie: `kakao_oauth_state`
- upstream request: `{ code: string }`
- success response: `{ success, code, message }`
- upstream access token: `access_token` HttpOnly cookie로 변환
- upstream refresh cookie: 브라우저에 HttpOnly cookie로 전달
- backend base URL: server-only `API_BASE_URL`

## OAuth State Policy

- callback `state`와 HttpOnly cookie의 `state`가 모두 존재하고 일치해야 합니다.
- 비교 실패 시 backend API를 호출하지 않고 `400 OAUTH_STATE_INVALID`를 반환합니다.
- 성공/실패와 관계없이 검증 시도 후 state cookie를 삭제해 재사용을 막습니다.

## Cookie Policy

- `access_token`: 공통 auth cookie helper의 `HttpOnly`, production `Secure`, `SameSite=Lax`, `Path=/` 정책
- `refreshToken`: 공통 auth cookie helper가 수명 속성을 보존하고 `Path=/api/auth/token/refresh`로 정규화
- client component는 두 token을 읽거나 저장하지 않습니다.

## Error

- 잘못된 JSON 또는 빈 code/state는 `400 INVALID_INPUT`으로 응답합니다.
- state가 없거나 일치하지 않으면 `400 OAUTH_STATE_INVALID`로 응답합니다.
- 백엔드 오류 status와 error body는 client에 전달합니다.
- 성공 응답에 access token 또는 refresh cookie가 없으면 `502 OAUTH_TOKEN_MISSING`으로 응답합니다.

## Verification

- [x] Route Handler integration test
- [x] client login mutation integration test
- [x] lint
- [x] typecheck
- [x] build
