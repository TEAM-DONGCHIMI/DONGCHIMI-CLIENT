# Kakao Authorize Route Handler Spec

## Metadata

- Jira: DCMCL-22, DCMCL-38
- Route: `GET /api/auth/kakao/authorize`
- Upstream: `GET https://kauth.kakao.com/oauth/authorize`
- Status: Implemented

## Purpose

- 브라우저에 Kakao JavaScript SDK를 로드하지 않고 REST API 키 기반 인가 흐름을 시작합니다.
- OAuth `state`를 서버에서 생성하고 HttpOnly cookie에 저장해 callback 위변조를 방어합니다.
- 로그인 전 검증된 `/markets` 하위 `returnTo`를 별도 HttpOnly cookie에 저장합니다.

## Contract

- server env: `KAKAO_REST_API_KEY`, `KAKAO_REDIRECT_URI`
- browser query: optional `returnTo`
- authorization query: `response_type=code`, `client_id`, `redirect_uri`, `state`
- response: Kakao authorization endpoint로 redirect
- cache: `no-store`

## OAuth Transaction Cookie Policy

- names: `kakao_oauth_state`, `kakao_oauth_return_to`
- attributes: `HttpOnly`, production `Secure`, `SameSite=Lax`
- path: `/api/auth/kakao`
- max age: 10 minutes
- `returnTo`는 `/markets` 또는 `/markets/` 하위 내부 상대 경로만 저장하며, 안전하지 않으면 `/markets`를 저장합니다.
- OAuth `state`는 opaque random value로 유지하고 `returnTo`를 섞지 않습니다.

## Error

- 환경변수가 없거나 redirect URI가 현재 요청 origin의 `/oauth/callback`과 일치하지 않으면 callback route의 설정 오류 상태로 redirect합니다.
- 설정 오류 응답에는 새 transaction cookie를 생성하지 않고 기존 state/returnTo cookie를 삭제합니다.

## Verification

- [x] Route Handler integration test
- [x] lint
- [x] typecheck
- [x] build
