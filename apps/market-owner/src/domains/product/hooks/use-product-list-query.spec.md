# Hook Spec: `useProductListQuery`

## Metadata

- Jira: `DCMSM-60`
- Hook: `useProductListQuery`
- Owner: `apps/market-owner/src/domains/product`
- Status: Implemented

## Purpose

- 사장님이 등록한 오늘의 특가와 행사 할인 상품 목록을 같은 query 구조로 조회합니다.
- 화면은 `type`만 `DAILY` 또는 `PERIODIC`으로 선택하고, API 계약과 cache key는 product 도메인이 소유합니다.

## Source Of Truth

- API: `GET /v1/owners/markets/{marketId}/products`
- OpenAPI generated type: `OwnerApiTypes.GetProductsData`
- Related pages: `TodaySpecialEditPage`, `EventDiscountEditPage`
- Related Jira: `DCMSM-60`

## Inputs

- `marketId`: 조회할 마트 ID
- `type`: `DAILY | PERIODIC`
- `sort`: `CATEGORY | LATEST | VIEW_COUNT`, 생략 시 `CATEGORY`

## Returns

- TanStack Query의 query result를 그대로 반환합니다.
- 성공 데이터는 Zod로 검증된 `OwnerApiTypes.GetProductsData`입니다.
- loading/error 상태는 hook이 숨기지 않고 호출 페이지가 처리합니다.

## Behavior

- `DAILY`와 `PERIODIC`은 query key가 분리됩니다.
- `marketId`, `type`, `sort`가 바뀌면 서로 다른 cache entry를 사용합니다.
- 기본 정렬을 생략한 호출과 `CATEGORY`를 명시한 호출은 같은 key를 사용합니다.
- API 및 Zod validation error는 query error로 노출합니다.

## API Contract

- endpoint: `/v1/owners/markets/{marketId}/products?type={type}&sort={sort}`
- method: `GET`
- response: 현재 OpenAPI 생성 타입 기준 `data.content`, `data.hasNext`, `data.nextCursor`
- query key: `['product', 'list', { marketId, type, sort }]`
- invalidation: 이 조회 작업에서는 수행하지 않습니다.

## Scope Decision

- API helper, query key, query options, hook만 product 도메인에 둡니다.
- `productQueryKeys`는 정적 계층만 선언하고, 응답을 바꾸는 동적 파라미터는 query options에서 결합합니다.
- 두 수정 페이지는 같은 hook을 사용하고 각각 `DAILY`, `PERIODIC`을 전달합니다.
- 응답-to-card mapping은 `domains/product/model/product-list.ts`에서 공통으로 처리합니다.
- 실제 `marketId` 공급 전까지 두 페이지 모두 임시 값 `1`을 사용합니다.
- 전달 문서의 `data.products`는 현재 OpenAPI 생성 타입의 `data.content`와 다르므로 생성 타입을 우선합니다.
- `cusor`는 오탈자 여부가 확인되지 않았고 현재 endpoint 타입에도 없으므로 이번 1차 범위에서 제외합니다.

## Verification

- [x] API helper success/validation/error 테스트
- [x] 계층형 query key와 response-changing params 테스트
- [x] `git diff --check`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test`
- [x] `pnpm --filter market-owner build`

## Open Questions

- 서버 응답이 `data.content`인지 `data.products`인지 OpenAPI와 endpoint 문서를 동기화해야 합니다.
- 요청 파라미터가 `cursor`인지 문서 표기인 `cusor`인지 확인해야 합니다.
