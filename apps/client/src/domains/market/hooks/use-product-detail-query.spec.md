# Hook Spec: `useProductDetailQuery`

## Metadata

- App: `client`
- Domain: `market`
- Hook: `useProductDetailQuery`
- Jira: DCMCL-13
- Status: Implemented

## Purpose

- 모바일 웹 상품 상세 route에서 사용자 상품 상세 조회 API를 TanStack Query로 호출합니다.
- API helper, query key, 화면 상태 처리를 domain boundary에 고정합니다.

## API Contract

- endpoint: `GET /v1/users/markets/{marketId}/products/{productId}`
- method: `GET`
- params: `marketId`, `productId`
- response: `ApiResponseProductDetailResponse`
  - wrapper: `success`, `code`, `message`, `data`
  - data: `productId`, `name`, `dealType`, `thumbnailUrl`, `originalPrice`, `discountedPrice`, `discountRate`, `promotionalPhrase`, `discountStartDate`, `discountEndDate`, `marketName`
- error: app-local `httpClient`가 network/server/configuration error를 정규화하고, response contract drift는 `ApiResponseValidationError`로 노출합니다.

## Query Key

- factory: `productDetailQueryKeys`
- response-changing params: `marketId`, `productId`
- shape: `['market', 'products', 'detail', { marketId, productId }]`
- dependency: 외부 query key factory 라이브러리는 추가하지 않고 domain-local factory 객체를 사용합니다.

## Query Options

- location: `apps/client/src/domains/market/query-options/product-detail-query-options.ts`
- responsibility: `queryKey`와 `queryFn`을 하나의 query contract로 묶습니다.
- hook responsibility: `useProductDetailQuery`는 `enabled`처럼 React usage policy만 얹습니다.
- management: server prefetch, route loader, cache read/write가 필요해지면 hook 내부 option을 복제하지 않고 `productDetailQueryOptions(params)`를 재사용합니다.

## Behavior

- enabled: `marketId`, `productId`가 빈 문자열이 아닐 때만 활성화합니다.
- loading: `ProductDetailPage`가 loading state message를 렌더링합니다.
- success: API 응답을 화면 모델로 매핑해 기존 상품 상세 UI에 전달합니다.
- empty: `data: null`이면 상품 정보 없음 상태를 렌더링합니다.
- error: 서버 메시지 또는 explicit fallback message를 노출하고 retry 버튼으로 `refetch`를 호출합니다.
- retry: QueryClient 기본 정책을 따르되 auth/validation error와 response validation error는 retry하지 않습니다.

## Verification

- [x] `git diff --check`
- [x] API contract checked
- [x] query key includes response-changing params
- [x] query options separate query identity from hook usage policy
- [x] `pnpm --filter client test:unit`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client build`
