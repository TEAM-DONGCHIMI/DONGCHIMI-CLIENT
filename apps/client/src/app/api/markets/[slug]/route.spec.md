# Market Detail Route Handler Spec

## Metadata

- Jira: DCMCL-18
- Route: `GET /api/markets/{slug}`
- Upstream: `GET /v1/users/markets/{slug}`
- Status: Implemented

## Purpose

- 브라우저와 동치미 백엔드 사이의 BFF 경계를 제공합니다.
- 백엔드 base URL을 browser bundle에 노출하지 않고 마트 상세 응답을 전달합니다.

## Contract

- request: path parameter `slug`
- response: 백엔드의 마트 상세 성공 또는 오류 envelope와 status를 유지합니다.
- backend base URL: server-only `API_BASE_URL`
- authentication: 공개 조회이므로 access token을 전달하지 않습니다.

## Error

- 빈 slug는 `400 INVALID_INPUT`으로 응답합니다.
- 백엔드 연결 또는 JSON 해석 실패는 `502 MARKET_DETAIL_UPSTREAM_FAILED`로 응답합니다.

## Verification

- [ ] Route Handler integration test
- [ ] market detail API helper test
- [ ] lint
- [ ] typecheck
- [ ] build
