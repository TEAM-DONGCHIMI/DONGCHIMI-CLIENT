# Daily Products Route Handler Spec

## Metadata

- Jira: `DCMCL-21`
- Route: `GET /api/markets/products/daily?marketId={marketId}`
- Owner: client market domain
- Status: Implemented

## Purpose

- 브라우저에 백엔드 origin과 server-only 환경변수를 노출하지 않고 오늘의 특가 API를 중계합니다.
- 백엔드 URL은 `apps/client/.env.local`의 `API_BASE_URL`을 사용합니다.

## Contract

- browser path: `/api/markets/products/daily?marketId={marketId}`
- backend path: `/v1/users/markets/{marketId}/products/daily`
- method: `GET`
- search parameter: 양의 정수 `marketId`
- authentication: HttpOnly `access_token` cookie가 있으면 backend `Authorization: Bearer` header로 전달합니다.
- response: 백엔드 status와 JSON body를 유지합니다.

## Error Behavior

- 유효하지 않은 `marketId`: `400 INVALID_INPUT`
- 환경변수 누락, network error, JSON parsing 실패: `502 DAILY_PRODUCTS_UPSTREAM_FAILED`
- 백엔드가 반환한 4xx/5xx: status와 body를 그대로 전달합니다.

## Verification

- [x] Route Handler integration test
- [x] `.env.local`의 `API_BASE_URL`을 사용한 local smoke test
- [x] `git diff --check`
