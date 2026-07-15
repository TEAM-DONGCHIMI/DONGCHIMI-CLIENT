# Periodic Products BFF Route Spec

## Metadata

- Jira: DCMCL-20
- Route: `GET /api/markets/products/periodic`
- Owner: `apps/client`
- Status: In Progress

## Purpose

브라우저가 access token을 직접 다루지 않고 행사 할인 상품 목록을 조회하도록 same-origin BFF 경계를 제공합니다.

## Contract

- query: required positive integer `marketId`
- query: optional `category`, positive integer `cursor`, positive integer `size`
- upstream: `GET /v1/users/markets/{marketId}/products/periodic`
- 인증: HttpOnly access token cookie를 `Authorization: Bearer` header로 전달합니다.
- 성공 및 API 오류: upstream status와 JSON body를 그대로 전달합니다.
- 잘못된 query: `400 INVALID_INPUT`
- upstream 연결 실패: `502 PERIODIC_PRODUCTS_UPSTREAM_FAILED`

## Verification

- [ ] 유효한 query와 access token을 upstream에 전달합니다.
- [ ] category, cursor, size를 누락 없이 전달합니다.
- [ ] 잘못된 marketId와 category를 upstream 요청 전에 거부합니다.
- [ ] upstream 오류 status와 body를 browser에 전달합니다.
