# Component Spec: `MarketProductsQueryContent`

## Metadata

- Jira: DCMCL-18, DCMCL-21
- App: `client`
- Domain: `market`
- Page: `market-products`
- Status: Implemented

## Purpose

`MarketProductsPage` 안에서 마트 상세 query를 실행하고, 마트 정보·인기 상품 TOP3·오늘의 특가 server-state를 표현합니다.

## Source Of Truth

- API: `GET /v1/users/markets/{slug}`
- Related page: `../MarketProductsPage.spec.md`
- Related hook: `../../../hooks/use-market-detail-query.spec.md`

## Scope

```text
MarketProductsQueryContent
  loading status
  error alert + retry button
  MarketOverviewSection
  PopularProductsSection
  TodaySpecialProductsQuerySection
    loading status
    error alert + retry button
    empty message
    TodaySpecialProductsSection
  EventDiscountProductsSection (fixture, out of current API scope)
```

## Public API

- component: `MarketProductsQueryContent`
- props: `marketSlug: string`
- exported types: `MarketProductsQueryContentProps`
- caller responsibility: route parameter의 slug를 전달합니다.
- non-owned behavior: URL parsing, header/back navigation, 행사 할인 query는 소유하지 않습니다.

## States

- loading: `role="status"`로 조회 중 메시지를 제공합니다.
- success: API의 마트 정보와 `top3`를 렌더링합니다.
- error: `role="alert"`와 `다시 시도` button을 표시하고, button은 query `refetch`를 호출합니다.
- empty: 마트 상세 API는 non-null object를 계약으로 하므로 별도 empty state를 두지 않습니다.
- daily products loading: 오늘의 특가 section 안에 `role="status"`를 표시합니다.
- daily products success: 마트 상세 응답의 `marketId`로 조회한 `totalCount`와 `products`를 렌더링합니다.
- daily products empty: `0건`과 등록 상품 없음 메시지를 표시합니다.
- daily products error: `role="alert"`와 오늘의 특가 전용 retry button을 표시합니다.

## Accessibility

- loading과 error 상태는 각각 live-region semantics를 갖는 `status`, `alert`를 사용합니다.
- retry action은 keyboard로 도달 가능한 native button입니다.
- 성공 상태의 section semantics와 상품 link accessible name은 각 section이 소유합니다.

## Constraints

- TanStack Query와 browser REST 호출이 필요하므로 이 leaf만 Client Component입니다.
- 상위 `MarketProductsPage`는 Server Component를 유지합니다.
- 마트 상세 및 오늘의 특가 API 오류를 조용히 숨기지 않습니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client test`
- [ ] `pnpm --filter client build`
- [ ] loading, success, error/retry state coverage
