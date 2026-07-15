# Nearby Markets Location Route Handler Spec

## Metadata

- Jira: DCMCL-19
- Route: `GET /api/markets/location`
- Upstream: `GET /v1/users/markets/location`
- Status: Implemented

## Purpose

- 브라우저가 지도/주변 마트 API를 백엔드에 직접 호출하지 않고 same-origin BFF 경계를 거치도록 합니다.
- 카카오 로그인 성공 시 저장된 `access_token` HttpOnly cookie를 서버에서 읽어 백엔드 요청의 `Authorization: Bearer ...` 헤더로 전달합니다.

## Contract

- request query: `lat`, `lng` 필수, `cursor`, `radius`, `size` 선택
- response: 백엔드의 주변 마트 목록 성공 또는 오류 envelope와 status를 유지합니다.
- backend base URL: server-only `API_BASE_URL`
- authentication: 테스트 토큰을 사용하지 않고, 카카오 로그인 후 설정된 `access_token` cookie를 사용합니다.

## Error

- `lat` 또는 `lng`가 없거나 숫자가 아니면 `400 INVALID_INPUT`으로 응답합니다.
- 백엔드 연결 또는 JSON 해석 실패는 `502 NEARBY_MARKETS_UPSTREAM_FAILED`로 응답합니다.

## Verification

- [ ] Route Handler integration test
- [ ] nearby markets API helper test
- [ ] lint
- [ ] typecheck
