# Market Products Page Spec

## Metadata

- Jira: DCMCL-9
- Figma: APPJAM, mobile web market leaflet flow
- Route: `/markets/[marketId]`
- Owner: `apps/client`
- Status: In Progress

## Purpose

사용자 모바일 웹에서 특정 마트의 전단 정보를 확인하고, 오늘의 특가와 행사 할인 상품을 탐색할 수 있는 페이지를 제공합니다.

## Source Of Truth

- Figma: `APPJAM`, node `1972:128425`
- Screenshots: 2026-07-10 마트 전단보기 flow 캡처
- Jira: DCMCL-9 `[FE][사용자 사이트] 마트 전단보기 페이지 UI 구현`
- API draft: market summary, today special products, event discount products, leaflet share QR JSON examples

## Scope

- `/markets/[marketId]` route의 placeholder `MarketProductsPage`를 실제 모바일 전단보기 화면으로 교체합니다.
- API 연동 전까지 page-local fixture로 마트 정보, 인기 상품 TOP3, 오늘의 특가, 행사 할인 상품 페이지, 공유 정보를 제공합니다.
- fixture shape은 API draft 필드명과 최대한 맞춰 후속 query 연동 시 page/section props 변경을 줄입니다.
- 공유하기는 기존 page-local `MarketShareBottomSheet`를 재사용합니다.
- 전화걸기는 확인 modal 후 `tel:` URL로 이동합니다.
- 상품 카드는 `/markets/[marketId]/products/[productId]` 상세 route로 이동합니다.
- TOP3와 오늘의 특가 상품은 `discountRate`로 할인칩을 표시하고, 행사 할인 상품 목록은 API 응답에 `discountRate`가 없어 할인칩을 표시하지 않습니다.

## Out Of Scope

- 실제 API query/mutation 연동
- 현재 영업중 여부 자체 계산 (`isOpenNow`는 API/fixture 값을 사용)
- Kakao SDK 공유 연동
- QR 코드 modal 또는 QR 이미지 표시
- 상품 상세 페이지 UI 변경
- 위치/지도/권한 처리
- empty/error/loading server state

## Layout And Sections

- `MobileHeader`: back action과 `전단보기` title을 제공합니다.
- `MarketOverviewSection`: 마트명, 영업 상태, 마트 이미지, 주소, 전화번호, 영업시간, 휴무일, 공유하기, 전화걸기 CTA를 표시합니다.
- `PopularProductsSection`: 조회수 기준 인기 상품 TOP3를 가로 카드 3개로 표시합니다.
- `TodaySpecialProductsSection`: 오늘의 특가 상품 일부를 먼저 표시하고, 버튼으로 전체/접기 상태를 전환합니다.
- `EventDiscountProductsSection`: 행사 할인 상품을 카테고리 chip과 3열 grid로 표시합니다.

## API Fixture Contract

- market summary: `marketId`, `name`, `thumbnailUrl`, `address`, `isOpenNow`, `businessHours`, `marketPhone1`, optional `marketPhone2`, `ownerPhone`, `top3[]`.
- top3 item: `productId`, `name`, `thumbnailUrl`, `discountedPrice`, `discountRate`.
- today special response: `totalCount`, `products[]`.
- today special item: `productId`, `name`, `thumbnailUrl`, `originalPrice`, `discountedPrice`, `discountRate`.
- event discount list query: path `marketId`, query `category`, `cursor`, `size`.
- event discount list page response: `products[]`, `hasNext`, nullable numeric `nextCursor`.
- event discount fixture: 실제 목록 응답과 같은 페이지 shape 배열을 사용하며, 첫 페이지와 다음 cursor 페이지 append 흐름을 제공합니다.
- event discount item: `productId`, `name`, `thumbnailUrl`, `discountedPrice`.
- leaflet share response: `marketId`, `marketName`, `slug`, `qrCode`.

## States

- default: 마트 정보, TOP3, 오늘의 특가 2개, 행사 할인 상품 전체 카테고리를 표시합니다.
- todaySpecialExpanded: 오늘의 특가 상품을 fixture 전체 개수로 표시하고 `접기`를 제공합니다.
- categoryExpanded: 행사 할인 카테고리 chip의 숨겨진 항목을 표시합니다.
- selectedCategory: `전체` 또는 개별 카테고리를 선택하면 행사 할인 상품 목록이 필터링됩니다.
- eventDiscountPagination: 첫 페이지로 시작하고, load-more sentinel이 viewport에 가까워지면 `hasNext`와 `nextCursor` 기준으로 다음 fixture 페이지를 기존 목록 아래에 append합니다.
- callModalOpen: 전화걸기 클릭 시 확인 modal을 표시합니다.
- shareSheetOpen: `MarketShareBottomSheet` primitive가 open state를 관리합니다.
- disabled: QR 코드 데이터는 fixture에 포함하되, QR 코드 보기는 이번 범위에서 handler를 전달하지 않아 비활성화됩니다.

## Behavior

- navigation: 상품 카드는 `CLIENT_ROUTES.marketProduct(marketId, productId)`로 이동합니다.
- back: header back button은 history가 있으면 `router.back()`, 없으면 `/markets`로 이동합니다.
- call: 전화걸기 확인 modal에서 확인하면 대표 전화번호의 `tel:` URL로 이동합니다. modal description은 `isOpenNow`가 true이면 오늘 요일에 맞는 영업 종료 시간을 찾아 `현재 영업중· HH:mm까지`로 표시하고, 오늘 종료 시간을 찾지 못하면 잘못된 시간을 표시하지 않고 `현재 영업중`까지만 표시합니다.
- share: 공유하기 button은 `MarketShareBottomSheet`를 열고 링크 복사는 컴포넌트에 위임합니다. 카카오톡 공유는 Kakao SDK 연동 전까지 준비중 toast로 피드백합니다.
- today special: 기본 2개 노출, 전체보기 시 fixture 전체 노출, 접기 시 기본 노출로 복귀합니다.
- category: 기본은 `전체` 선택, 기본 노출 chip은 사용 가능한 첫 줄 폭에 맞춰 계산합니다. 숨겨진 카테고리가 있으면 첫 줄에 `더보기`를 함께 배치하고, 더보기 클릭 시 나머지 카테고리를 보여줍니다. 카테고리 변경 시 행사 할인 상품은 첫 페이지부터 다시 표시합니다.
- event discount infinite scroll: 행사 할인 상품 grid 하단의 sentinel이 viewport에 가까워지면 다음 fixture 페이지를 append합니다. 다음 페이지가 없으면 sentinel을 렌더링하지 않으며, 이미 요청한 cursor는 중복 append하지 않습니다.
- API: 없음. API 연동은 후속 이슈에서 query hook으로 분리합니다.

## Accessibility

- header title은 `h1`으로 렌더링합니다.
- 주요 section은 `aria-labelledby`로 제목과 연결합니다.
- 상품 상세 이동 요소는 link이며 상품명과 가격을 accessible name으로 제공합니다.
- 카테고리 chip은 `aria-pressed`를 가진 button으로 선택 상태를 전달합니다.
- 전화 확인은 기존 `MobileModal`의 dialog semantics를 따릅니다.
- back, share, call, expand/collapse button은 keyboard focus가 가능해야 합니다.

## Responsive

- primary viewport: mobile web, 375px 기준
- scroll: page 전체 세로 스크롤
- sticky/fixed: header는 상단 sticky
- tablet/desktop: 모바일 폭을 기준으로 자연스럽게 늘어나되, 핵심 콘텐츠는 overflow 없이 유지합니다.
- product grid: TOP3와 행사 할인 상품 grid는 3열을 유지하고, 작은 화면에서는 카드 이미지가 정사각 비율로 함께 줄어듭니다. 행사 할인 상품의 `PeriodProductCard`는 실제 3열 grid 폭에 맞는 `imageSizes`를 전달합니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client test`
- [ ] `pnpm --filter client build`
- [ ] browser route: `/markets/mangwon-fresh`, mobile viewport 375px

## Open Questions

- 실제 API 연동 시 오늘의 특가 전체보기는 현재 응답 전체 노출인지 cursor pagination인지 endpoint 확정이 필요합니다.
- QR 코드 보기는 후속 scope에서 QR image modal, toast, 또는 별도 route 중 하나로 확정해야 합니다.
