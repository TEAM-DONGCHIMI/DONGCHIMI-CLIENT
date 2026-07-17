# Kakao Login Route Handler Spec

## Metadata

- Jira: DCMCL-17, DCMCL-22, DCMCL-38
- Route: `POST /api/auth/kakao/login`
- Upstream: `POST /v1/users/login/oauth2/kakao`
- Status: Implemented

## Purpose

- 브라우저와 동치미 백엔드 사이의 인증 BFF 경계를 제공합니다.
- 카카오 인가 코드와 `state`를 검증하고, 검증된 인가 코드만 백엔드로 전달합니다.
- token을 client JavaScript에 노출하지 않습니다.
- authorize 단계에서 저장한 `returnTo`를 재검증해 로그인 성공 응답으로 반환합니다.

## Contract

- browser request: `{ code: string, state: string }`
- browser cookies: `kakao_oauth_state`, `kakao_oauth_return_to`
- upstream request: `{ code: string }`
- success response: `{ success, code, message, redirectTo }`
- upstream access token: `access_token` HttpOnly cookie로 변환
- upstream refresh cookie: 응답에 포함된 경우 브라우저에 HttpOnly cookie로 전달
- backend base URL: server-only `API_BASE_URL`

## OAuth State Policy

- callback `state`와 HttpOnly cookie의 `state`가 모두 존재하고 일치해야 합니다.
- 비교 실패 시 backend API를 호출하지 않고 `400 OAUTH_STATE_INVALID`를 반환합니다.
- 성공/실패와 관계없이 검증 시도 후 state/returnTo cookie를 삭제해 재사용을 막습니다.

## Return Path Policy

- `kakao_oauth_return_to` cookie는 URL decoding 후 공통 returnTo helper로 다시 검증합니다.
- `/markets` 또는 `/markets/` 하위 pathname과 search params만 허용합니다.
- cookie가 없거나 변조되었거나 허용 범위를 벗어나면 로그인은 실패시키지 않고 `/markets`를 반환합니다.
- callback page는 응답의 `redirectTo`를 다시 검증한 뒤 replace 이동합니다.

## Cookie Policy

- `access_token`: 공통 auth cookie helper의 `HttpOnly`, production `Secure`, `SameSite=Lax`, `Path=/` 정책
- `refreshToken`: upstream `refresh_token`을 공통 auth cookie helper가 browser cookie 이름으로 변환하고 수명 속성을 보존한 채 `Path=/api/auth/token/refresh`로 정규화
- client component는 두 token을 읽거나 저장하지 않습니다.

## Error

- 잘못된 JSON 또는 빈 code/state는 `400 INVALID_INPUT`으로 응답합니다.
- state가 없거나 일치하지 않으면 `400 OAUTH_STATE_INVALID`로 응답합니다.
- 백엔드가 정상적인 API 오류 body를 반환하면 status와 body를 client에 전달합니다.
- `API_BASE_URL` 설정 누락은 `500 OAUTH_CONFIGURATION_ERROR`로 응답합니다.
- 백엔드 연결/timeout 실패는 `502 OAUTH_UPSTREAM_FAILED`로 응답합니다.
- 백엔드 body가 JSON이 아니거나 응답 계약과 다르면 `502 OAUTH_UPSTREAM_INVALID_RESPONSE`로 응답합니다.
- 성공 응답에 access token이 없으면 `502 OAUTH_TOKEN_MISSING`으로 응답합니다.
- refresh cookie는 사용자 API 성공 계약의 필수 필드가 아니므로, 누락되어도 로그인 성공을 502로 바꾸지 않습니다.

## Verification

- [x] Route Handler integration test
- [x] client login mutation integration test
- [x] lint
- [x] typecheck
- [x] build
