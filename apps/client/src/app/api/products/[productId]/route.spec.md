# Product Detail BFF Route Spec

## Metadata

- Jira: DCMCL-13
- Route: `GET /api/products/[productId]?marketId={marketId}`
- Upstream: `GET /v1/users/markets/{marketId}/products/{productId}`
- Owner: apps/client

## Contract

- `marketId`, `productId`는 양의 정수만 허용합니다.
- access token cookie가 있으면 server API client가 `Authorization: Bearer` header로 전달합니다.
- upstream의 정상 및 4xx 응답 status/body를 browser에 그대로 전달합니다.
- 설정, 네트워크, JSON parsing 실패는 `502 PRODUCT_DETAIL_UPSTREAM_FAILED`로 정규화합니다.
- `API_BASE_URL`은 server-only 환경 변수이며 browser bundle에 노출하지 않습니다.

## Verification

- route integration test에서 성공 요청 경로와 인증 header를 확인합니다.
- route integration test에서 upstream 오류 전달과 입력 검증을 확인합니다.
