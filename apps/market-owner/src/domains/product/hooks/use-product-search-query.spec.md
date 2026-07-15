# Hook Spec: `useProductSearchQuery`

## Metadata

- Jira: `DCMSM-73`
- Hook: `useProductSearchQuery`
- Owner: `apps/market-owner/src/domains/product`
- Status: Implemented

## Purpose

- 사장님웹 공통 헤더에서 현재 마트의 할인 상품을 상품명으로 검색합니다.
- 홈과 상품 수정 화면은 같은 product domain query를 사용하고, 선택 후 navigation은 각 호출부가 담당합니다.

## Source Of Truth

- API: `GET /v1/owners/markets/{marketId}/products/search`
- OpenAPI generated type: `OwnerApiTypes.SearchData`
- Related component: `ProductHeaderSearch`, `ProductSearchPanel`
- Related Jira: `DCMSM-38`, `DCMSM-60`, `DCMSM-73`

## Inputs

- `marketId`: 조회할 마트 ID
- `keyword`: trim된 상품 검색어
- `size`: 최대 검색 결과 수. 헤더 검색은 10을 사용하며 생략 시 10으로 정규화합니다.

## Returns

- TanStack Query의 query result를 그대로 반환합니다.
- 성공 데이터는 Zod로 검증된 `OwnerApiTypes.SearchData`입니다.
- pending/error 상태는 숨기지 않고 호출부가 `ProductHeaderSearch` props로 전달합니다.

## Behavior

- trim된 `keyword`가 비어 있으면 query를 실행하지 않습니다.
- `marketId`, `keyword`, `size`가 바뀌면 서로 다른 cache entry를 사용합니다.
- 성공 응답의 `data.products` 순서를 변경하지 않습니다.
- `products: []`는 성공한 empty 상태로 처리합니다.
- API 및 Zod validation error는 query error로 노출합니다.
- 검색 입력 400 오류는 앱의 query retry 정책에 따라 자동 재시도하지 않습니다.

## API Contract

- endpoint: `/v1/owners/markets/{marketId}/products/search?keyword={keyword}&size={size}`
- method: `GET`
- response: `data.products[].productId`, `name`, `dealType`
- query key: `['product', 'search', { marketId, keyword, size }]`
- invalidation: 이 조회 작업에서는 수행하지 않습니다.
- error mapping: 공용 `httpClient`의 `ApiError`와 `validateApiResponse`의 validation error를 유지합니다.

## Constraints

- cache: TanStack Query 앱 기본 cache 정책을 따릅니다.
- concurrency/cancellation: TanStack Query 기본 동작을 따르며 별도 취소 계층을 추가하지 않습니다.
- accessibility impact: 호출부는 pending/empty/error 상태를 기존 검색 패널 semantics로 노출합니다.
- 현재 `marketId` 공급은 DCMSM-60의 임시 정책과 동일하게 `1`을 사용하고 별도 인증/session 구조를 추가하지 않습니다.

## Verification

- [x] `git diff --check`
- [x] Frontend Fundamentals self-check
- [x] Logic composition self-check
- [x] blank/pending/success/empty/error 상태 검증
- [x] API contract와 query key 검증

## Open Questions

- Swagger/OpenAPI의 `keyword` optional 표기를 실제 서버 동작에 맞게 required로 수정해야 합니다.
- 실제 session 기반 `marketId` 공급은 인증 영역 후속 작업에서 교체합니다.
