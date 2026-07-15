# Kakao Authorize Route Handler Spec

## Metadata

- Jira: DCMCL-22
- Route: `GET /api/auth/kakao/authorize`
- Upstream: `GET https://kauth.kakao.com/oauth/authorize`
- Status: Implemented

## Purpose

- 브라우저에 Kakao JavaScript SDK를 로드하지 않고 REST API 키 기반 인가 흐름을 시작합니다.
- OAuth `state`를 서버에서 생성하고 HttpOnly cookie에 저장해 callback 위변조를 방어합니다.

## Contract

- server env: `KAKAO_REST_API_KEY`, `KAKAO_REDIRECT_URI`
- authorization query: `response_type=code`, `client_id`, `redirect_uri`, `state`
- response: Kakao authorization endpoint로 redirect
- cache: `no-store`

## State Cookie Policy

- name: `kakao_oauth_state`
- attributes: `HttpOnly`, production `Secure`, `SameSite=Lax`
- path: `/api/auth/kakao`
- max age: 10 minutes

## Error

- 환경변수가 없거나 redirect URI가 현재 요청 origin의 `/oauth/callback`과 일치하지 않으면 callback route의 설정 오류 상태로 redirect합니다.
- 설정 오류 응답에는 state cookie를 생성하지 않습니다.

## Verification

- [x] Route Handler integration test
- [x] lint
- [x] typecheck
- [x] build
