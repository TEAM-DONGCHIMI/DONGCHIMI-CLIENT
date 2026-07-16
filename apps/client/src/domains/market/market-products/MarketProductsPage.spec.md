# Market Products Page Spec

## Metadata

- Jira: DCMCL-9, DCMCL-18, DCMCL-20, DCMCL-21, DMCL-24, DCMCL-28, DCMCL-34
- Figma: APPJAM, mobile web market leaflet flow
- Route: `/markets/[slug]`
- Owner: `apps/client`
- Status: In Progress

## Purpose

사용자 모바일 웹에서 특정 마트의 정보와 전단 상품을 조회하고 탐색할 수 있는 페이지를 제공합니다.

## Scope

- route의 `slug`로 마트 상세와 인기 상품 TOP3를 조회합니다.
- 마트 상세 응답의 `marketId`로 오늘의 특가와 행사 할인 상품을 조회합니다.
- 행사 상품은 전체 또는 서버 `ProductCategory` enum별 cursor pagination을 사용합니다.
- 상품 카드는 `/markets/[slug]/products/[productId]`로 이동합니다.
- 공유하기는 `MarketShareBottomSheet`를 재사용하고, 공유 시트의 `앱으로 전단보기`는 PWA 설치 안내 시트로 전환합니다.
- 전화걸기는 확인 modal 후 `tel:` URL로 이동합니다.

## Layout And Sections

- `MobileHeader`: back action과 `전단보기` title을 제공합니다.
- `MarketOverviewSection`: 마트명, 영업 상태, 주소, 전화번호, 영업시간, 휴무일, 공유/전화 CTA를 표시합니다.
- `PopularProductsSection`: 조회수 기준 인기 상품 TOP3를 표시합니다.
- `TodaySpecialProductsSection`: 오늘의 특가 API 상품을 기본 2개 표시하고 전체보기/접기를 제공합니다.
- `EventDiscountProductsSection`: 행사 상품을 category chip과 3열 무한 목록으로 표시합니다.

## API Contract

- market detail browser endpoint: `GET /api/markets/{slug}`
- market detail upstream: `GET /v1/users/markets/{slug}`
- market summary: `marketId`, `name`, `thumbnailUrl`, `address`, `isOpenNow`, `isHolidayClosed`, `businessHours`, 전화번호, `top3[]`. 공휴일을 포함한 영업 상태는 서버의 `isOpenNow`를 그대로 표시하며 별도의 공휴일 휴무 문구는 추가하지 않습니다.
- daily products browser endpoint: `GET /api/markets/products/daily?marketId={marketId}`
- daily products upstream: `GET /v1/users/markets/{marketId}/products/daily`
- daily products response: `totalCount`, `products[]`
- daily item: `productId`, `name`, nullable `thumbnailUrl`, `originalPrice`, `discountedPrice`, `discountRate`
- periodic products browser endpoint: `GET /api/markets/products/periodic`
- periodic products query: required `marketId`, optional `category`, `cursor`, `size`
- periodic products upstream: `GET /v1/users/markets/{marketId}/products/periodic`
- periodic category: `VEGETABLE_FRUIT`, `MEAT_EGG`, `SEAFOOD`, `DAIRY`, `CONVENIENCE_FOOD`, `PROCESSED_FOOD`, `BEVERAGE_ALCOHOL`, `HOUSEHOLD_GOODS`, `ETC`
- periodic page: `content[]`, `hasNext`, nullable numeric `nextCursor`, `availableCategories[]`
- periodic item: `productId`, `name`, nullable `thumbnailUrl`, `discountedPrice`
- browser는 same-origin BFF만 호출하며 access token을 직접 다루지 않습니다.
- Route Handler는 HttpOnly access token cookie를 upstream Bearer header에 전달합니다.

## States

- marketDetailLoading: 마트 상세 조회 중 status를 표시합니다.
- marketDetailError: 마트 상세 조회 실패 시 alert와 retry action을 표시합니다.
- todaySpecialLoading: 오늘의 특가 section에 조회 중 status를 표시합니다.
- todaySpecialError: 오늘의 특가 section에 alert와 retry action을 표시합니다.
- todaySpecialEmpty: `0건`과 등록 상품 없음 메시지를 표시합니다.
- todaySpecialExpanded: API 응답 전체를 표시하고 `접기`를 제공합니다.
- eventDiscountLoading: 첫 행사 상품 페이지 조회 중 status를 표시합니다.
- eventDiscountError: 첫 페이지 실패 시 alert와 retry action을 표시합니다.
- eventDiscountEmpty: 마지막 페이지까지 상품이 없으면 빈 상태를 표시합니다.
- eventDiscountPagination: sentinel이 viewport에 가까워지면 다음 cursor 페이지를 append합니다.
- eventDiscountNextPageError: 기존 상품을 유지하고 다음 페이지 retry action을 표시합니다.

## Behavior

- `MarketProductsPage`는 header와 query leaf 조립을 담당하는 Server Component로 유지합니다.
- `MarketProductsQueryContent`는 마트 상세 조회 성공 후 `market.marketId`를 오늘의 특가와 행사 상품 조회에 전달합니다.
- 오늘의 특가는 기본 2개를 노출하고 상품이 2개 이하이면 toggle을 표시하지 않습니다.
- 행사 상품의 기본 category는 전체이며 category query를 보내지 않습니다.
- `availableCategories`에 포함된 category만 width 측정 훅의 입력으로 사용합니다.
- 첫 줄에 가용 category 중 화면 너비에 들어가는 항목을 노출하고 나머지만 더보기에 표시합니다.
- category 전환 요청 중에는 마지막 정상 `availableCategories`를 유지해 chip layout 이동을 방지합니다.
- category 변경은 별도 query key를 사용해 첫 페이지부터 다시 조회합니다.
- 다음 페이지는 `hasNext`가 true이고 `nextCursor`가 있을 때만 요청합니다.
- 이미 사용한 `nextCursor`가 반환되면 반복 요청을 중단합니다.
- observer의 연속 intersection은 진행 중인 다음 페이지 요청을 중복 실행하지 않습니다.
- TanStack Query의 abort signal을 browser request와 upstream request에 전달합니다.
- 설치 가능한 브라우저의 `홈 화면에 추가하기`는 사용자 제스처 안에서 네이티브 설치 prompt를 호출합니다.
- 설치 prompt 지원 여부나 설치 상태에 따라 디자인에 없는 앱 내부 후속 안내 view를 추가하지 않습니다.
- 내용이 없는 중간 페이지라도 `hasNext`가 true이면 최종 빈 상태로 확정하지 않습니다.
- 각 페이지 grid는 `content-visibility: auto`로 화면 밖 렌더링 비용을 줄입니다.
- 무한 목록 상품 link는 viewport 진입만으로 상세 route를 대량 요청하지 않도록 prefetch를 비활성화합니다.
- TOP3, 오늘의 특가와 행사 할인 상품 link는 상세 이동 직전에 상품 ID, section, anchor ID, viewport 상대 위치와 fallback `scrollY`를 route 단위 sessionStorage에 저장합니다.
- 상품 link를 클릭하면 현재 목록 history entry에 snapshot과 연결된 일회성 복원 token을 표시합니다.
- 오늘의 특가 상품에서 돌아오면 저장한 전체보기 펼침 상태를 먼저 적용해 클릭 상품 anchor를 다시 렌더링합니다.
- 행사 할인 상품에서 돌아오면 저장한 category와 category 더보기 상태를 먼저 적용합니다.
- 행사 할인 category 복원은 동일한 `marketId + category` query key를 다시 사용하므로 TanStack Query가 보유한 무한 목록 `pages/pageParams`를 그대로 렌더링합니다.
- 행사 할인 무한 목록의 비활성 캐시는 상세 탐색 시간을 고려해 30분 동안 유지합니다.
- 저장한 목록 history entry가 다시 활성화됐을 때만 snapshot을 복원하며 일반적인 목록 신규 진입에서는 과거 상태를 적용하지 않습니다.
- Next App Router가 목록 컴포넌트를 재사용하는 경우에도 `popstate`를 구독해 snapshot을 React 상태로 반영합니다.
- 목록 component가 먼저 마운트된 뒤 snapshot이 도착해도 `restorationId`를 기준으로 오늘의 특가 펼침 상태와 행사 category 상태를 한 번 적용합니다.
- 전역 page의 세로 scroll은 `window/documentElement`가 소유하며 body를 별도 scroll container로 만들지 않습니다.
- anchor가 렌더링되면 저장한 viewport 상대 위치와 현재 위치의 차이만큼 즉시 보정하고, 연속 frame에서 위치가 안정되면 완료합니다.
- 제한 시간까지 anchor 위치가 안정되지 않거나 찾지 못하면 저장한 절대 `scrollY`를 사용합니다.
- 복원 정보는 성공 또는 fallback 처리 후 제거하며 sessionStorage 접근 실패는 기존 link 이동을 방해하지 않습니다.

## Accessibility

- category chip은 `aria-pressed`로 선택 상태를 전달합니다.
- 더보기 chip은 `aria-expanded`로 펼침 상태를 전달합니다.
- loading과 error는 각각 `status`, `alert` role을 사용합니다.
- retry action과 상품 상세 link는 keyboard로 실행할 수 있습니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter client test`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client build`
- [x] browser route: `/markets/mangwon-fresh`, mobile viewport 375px with fixed API responses

## Out Of Scope

- 전단 공유 정보 API 연동과 QR modal
- Kakao SDK 공유 연동
- 상품 상세 페이지 UI 변경
- 위치, 지도, 권한 처리
- 새로고침 또는 앱 재실행 이후의 무한 목록 영속화
- 다른 목록 route의 전역 스크롤 복원 정책
- 사용자가 이동 과정을 보게 되는 smooth scroll 애니메이션
