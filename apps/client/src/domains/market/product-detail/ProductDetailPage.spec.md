# Product Detail Page Spec

## Metadata

- Jira: DCMCL-10
- Related Jira: DCMCL-13
- Screen ID: APPJAM `1972:129194` `상품 상세_[오늘의 특가 상품]`, APPJAM `1972:129231` `상품 상세_[행사 할인 상품]`
- Route: `/markets/[slug]/products/[productId]`
- Owner: apps/client
- Status: Implemented, API integrated by DCMCL-13

## Purpose

- 공개 마트 URL의 `slug`를 숫자 `marketId`로 해소한 뒤 사용자 상품 상세 API를 조회합니다.
- 오늘의 특가와 행사 할인 상품은 같은 route shell을 공유하고 상품 유형별 header, chip, 가격, 행사 기간만 분기합니다.

## Source Of Truth

- Figma: APPJAM `1972:129194`, `1972:129231`
- API: `GET /v1/users/markets/{marketId}/products/{productId}`
- Related Jira: DCMCL-10, DCMCL-13

## Scope

- `/markets/[slug]/products/[productId]` route entry와 `ProductDetailPage`는 Server Component로 유지합니다.
- page-local `ProductDetailQueryContent`가 마트 상세와 상품 상세 TanStack Query 상태를 소유합니다.
- browser는 same-origin BFF만 호출하고, BFF가 server-only `API_BASE_URL`과 인증 cookie로 백엔드 요청을 중계합니다.
- API 응답의 `thumbnailUrl`이 없으면 fallback surface를 표시하고, `promotionalPhrase`가 없으면 comment card를 숨깁니다.
- API 응답의 `data`가 `null`이면 상품 정보 없음 상태를 표시합니다.

## Out Of Scope

- 실제 상품 이미지 asset 제작
- 구매, 전화, 공유 action
- 상품 목록 API 조회
- 새 디자인시스템 public component 또는 token contract

## Routing And Data Flow

1. route의 `slug`, `productId`를 `ProductDetailPage`에 전달합니다.
2. `useMarketDetailQuery({ slug })`로 마트 상세를 조회합니다.
3. 마트 응답의 숫자 `marketId`와 route의 `productId`가 모두 유효할 때 상품 상세 query를 활성화합니다.
4. browser는 `GET /api/products/{productId}?marketId={marketId}`를 호출합니다.
5. Route Handler는 `GET /v1/users/markets/{marketId}/products/{productId}` 응답 status와 body를 전달합니다.

## Layout And Sections

- mobile header: 뒤로가기 button과 상품 유형 title
- product image: viewport width 기준 정사각형 이미지 또는 fallback
- product summary: 마트명, 행사 chip, 상품명, 가격
- today special price: 할인율, 판매가, 원가 취소선 가격
- event discount price: 행사 chip, 기간 chip, 판매가
- mart comment card: 점장 한마디가 있을 때만 표시

## States

- loading: 마트 식별자 해소 또는 상품 상세 조회 중 message를 표시합니다.
- error: 마트/상품 API 오류 message와 해당 query의 retry action을 표시합니다.
- empty: 상품 응답 `data: null` 또는 유효하지 않은 `productId`를 상품 정보 없음 상태로 표시합니다.
- success: API 응답을 화면 view model로 변환해 렌더링합니다.

## Query Contract

- query key: `['market', 'products', 'detail', { marketId, productId }]`
- query options: `productDetailQueryOptions(params)`가 `queryKey`, `queryFn`을 소유합니다.
- hook policy: `useProductDetailQuery`가 유효한 숫자 `marketId`, `productId`가 준비된 경우에만 query를 활성화합니다.
- retry: QueryClient 기본 정책을 따르되 auth/validation/response validation error는 retry하지 않습니다.

## Accessibility

- 뒤로가기 button은 `상품 목록으로 돌아가기` accessible name을 갖습니다.
- API 상태는 `status` 또는 `alert` live region으로 전달합니다.
- 상품 이미지는 API 상품명을 포함한 대체 텍스트를 사용하고 fallback도 같은 의미를 숨김 텍스트로 제공합니다.
- 상품명은 content section heading입니다.

## Responsive

- 375px 기준 product image는 정사각형이고 content gutter는 20px입니다.
- 390/414/430px에서도 horizontal overflow 없이 app shell을 채웁니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client test:unit`
- [x] `pnpm --filter client test:integration`
- [x] `pnpm --filter client build`
- [x] browser route at 375px and 430px

## Open Questions

- 최종 상품 이미지 fallback asset 또는 카테고리별 fallback 정책
