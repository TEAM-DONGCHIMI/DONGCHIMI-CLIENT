# Market Products Page Spec

## Metadata

- Jira: DCMCL-9, DCMCL-18, DCMCL-20
- Figma: APPJAM, mobile web market leaflet flow
- Route: `/markets/[slug]`
- Owner: `apps/client`
- Status: In Progress

## Purpose

사용자 모바일 웹에서 특정 마트의 전단 정보와 행사 할인 상품을 조회하고 탐색할 수 있는 페이지를 제공합니다.

## Scope

- route의 `slug`로 마트 상세를 조회합니다.
- 마트 상세 응답의 `marketId`로 행사 할인 상품 목록을 조회합니다.
- 행사 상품은 전체 또는 서버 `ProductCategory` enum별 cursor pagination을 사용합니다.
- 상품 카드는 `/markets/[slug]/products/[productId]`로 이동합니다.
- 오늘의 특가 상품은 해당 API 연동 전까지 page-local fixture를 유지합니다.

## API Contract

- market detail browser endpoint: `GET /api/markets/{slug}`
- periodic products browser endpoint: `GET /api/markets/products/periodic`
- periodic products query: required `marketId`, optional `category`, `cursor`, `size`
- periodic products upstream: `GET /v1/users/markets/{marketId}/products/periodic`
- periodic category: `VEGETABLE_FRUIT`, `MEAT_EGG`, `SEAFOOD`, `DAIRY`, `CONVENIENCE_FOOD`, `PROCESSED_FOOD`, `BEVERAGE_ALCOHOL`, `HOUSEHOLD_GOODS`, `ETC`
- periodic page: `content[]`, `hasNext`, nullable numeric `nextCursor`, `availableCategories[]`
- periodic item: `productId`, `name`, nullable `thumbnailUrl`, `discountedPrice`
- browser는 same-origin BFF만 호출하며 access token을 직접 읽거나 전달하지 않습니다.
- Route Handler는 HttpOnly access token cookie를 upstream Bearer header에 전달합니다.

## States

- marketDetailLoading: 마트 상세 조회 중 status를 표시합니다.
- marketDetailError: 마트 상세 조회 실패 시 alert와 retry action을 표시합니다.
- eventDiscountLoading: 첫 행사 상품 페이지 조회 중 status를 표시합니다.
- eventDiscountError: 첫 페이지 실패 시 alert와 retry action을 표시합니다.
- eventDiscountEmpty: 마지막 페이지까지 상품이 없으면 빈 상태를 표시합니다.
- eventDiscountPagination: sentinel이 viewport에 가까워지면 다음 cursor 페이지를 append합니다.
- eventDiscountNextPageError: 기존 상품을 유지하고 다음 페이지 retry action을 표시합니다.

## Behavior

- `MarketProductsQueryContent`는 상세 조회 성공 후 `market.marketId`를 행사 상품 섹션에 전달합니다.
- 기본 category는 전체이며 category query를 보내지 않습니다.
- `availableCategories`에 포함된 카테고리만 기존 width 측정 훅의 입력으로 사용합니다.
- 첫 줄에는 가용 카테고리 중 화면 너비에 들어가는 항목을 노출하고 나머지만 더보기에 표시합니다.
- 카테고리 전환 요청 중에는 마지막 정상 `availableCategories`를 유지해 chip layout 이동을 방지합니다.
- 카테고리 변경은 별도 query key를 사용해 해당 카테고리의 첫 페이지를 조회합니다.
- 다음 페이지는 `hasNext`가 true이고 `nextCursor`가 있을 때만 요청합니다.
- observer의 연속 intersection은 진행 중인 다음 페이지 요청을 중복 실행하지 않습니다.
- TanStack Query의 abort signal을 browser request와 upstream request에 전달합니다.
- 내용이 없는 중간 페이지라도 `hasNext`가 true이면 최종 빈 상태로 확정하지 않습니다.
- 각 페이지 grid는 `content-visibility: auto`로 화면 밖 렌더링 비용을 줄입니다.
- 무한 목록 상품 링크는 viewport 진입만으로 상세 route를 대량 요청하지 않도록 prefetch를 비활성화합니다.

## Accessibility

- 카테고리 chip은 `aria-pressed`로 선택 상태를 전달합니다.
- 더보기 chip은 `aria-expanded`로 펼침 상태를 전달합니다.
- loading과 error는 각각 `status`, `alert` role을 사용합니다.
- retry action과 상품 상세 link는 keyboard로 실행할 수 있습니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client test`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
- [ ] browser route: `/markets/mangwon-fresh`, mobile viewport 375px

## Out Of Scope

- 오늘의 특가 상품 API 연동
- 전단 공유 정보 API 연동과 QR modal
- Kakao SDK 공유 연동
