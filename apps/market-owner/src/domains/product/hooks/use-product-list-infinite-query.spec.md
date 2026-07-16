# Hook Spec: `useProductListInfiniteQuery`

## Metadata

- Jira: `DCMSM-96`
- Hook: `useProductListInfiniteQuery`
- Owner: `apps/market-owner/src/domains/product`
- Status: Implemented

## Purpose

- 사장님이 등록한 오늘의 특가와 행사 할인 상품을 cursor pagination으로 조회합니다.
- 서버가 내려준 `nextCursor`를 다음 요청의 `cursor` query parameter로 그대로 전달합니다.

## Source Of Truth

- API: `GET /v1/owners/markets/{marketId}/products`
- OpenAPI generated response type: `OwnerApiTypes.GetProductsData`
- Related pages: `TodaySpecialEditPage`, `EventDiscountEditPage`
- Related Jira: `DCMSM-60`, `DCMSM-96`

## Inputs

- `marketId`: 조회할 마트 ID
- `type`: `DAILY | PERIODIC`
- `sort`: `CATEGORY | LATEST | VIEW_COUNT`, 생략 시 `CATEGORY`
- `size`: 페이지당 상품 수, 생략 시 `12`

## Returns

- TanStack Query의 infinite query result를 그대로 반환합니다.
- 각 page는 Zod로 검증된 `OwnerApiTypes.GetProductsData`입니다.
- 화면은 `data.pages`를 순서대로 병합해 렌더링합니다.

## Behavior

- 첫 페이지는 `cursor` 없이 요청합니다.
- `hasNext=true`이고 `nextCursor`가 있으면 해당 값을 다음 요청의 `cursor`로 사용합니다.
- `hasNext=false`, `nextCursor=null`, 이미 요청한 cursor 반복 시 다음 요청을 중단합니다.
- `marketId`, `type`, `sort`, `size`가 바뀌면 서로 다른 cache entry를 사용합니다.
- cursor는 page parameter이므로 query key에 포함하지 않습니다.
- 다음 페이지 오류는 기존 page data를 유지하고 호출부에 `isFetchNextPageError`로 노출합니다.

## API Contract

- endpoint: `/v1/owners/markets/{marketId}/products`
- query: `type`, `sort`, `cursor`, `size`
- response: 현재 OpenAPI 생성 타입 기준 `data.content`, `data.hasNext`, `data.nextCursor`
- query key: `['product', 'list', { marketId, type, sort, size }]`

## Verification

- [x] API helper가 서버의 `cursor` query parameter를 전달합니다.
- [x] `nextCursor`와 종료 조건을 검증합니다.
- [x] 같은 cursor 반복 요청을 막습니다.
- [x] 페이지 병합 시 `productId` 중복을 제거합니다.
- [x] 다음 페이지 loading/error 중 기존 목록을 유지합니다.
