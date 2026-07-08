# React Page Spec: `HomePage`

## Metadata

- App: `market-owner`
- Domain: `home`
- Page: `overview`
- Route: `/`
- Path: `apps/market-owner/src/domains/home/overview/HomePage.tsx`
- Jira: DCMSM-27
- Related Jira: DCMSM-15 route scaffold
- Status: Implemented

## Purpose

사장님 사이트의 protected desktop home route를 첨부된 홈 검색패널/대시보드 화면 기준으로
퍼블리싱합니다. 이번 범위는 실제 상품/검색/공유 API가 아니라 fixture 기반 UI와 화면 구조를
고정하는 데 집중합니다.

## Source Of Truth

- Jira: DCMSM-27 `[FE][사장님 사이트] 홈 페이지 UI 구현`
- Design evidence: 홈\_검색패널(호버시) 캡처 이미지
- Figma: [APPJAM 홈\_검색패널(호버시) node 2273:132751](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=2273-132751&m=dev)
- Hero Figma: [APPJAM hero container node 2403:118466](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=2403-118466&m=dev)
- Hero action Figma: [APPJAM hero quick action node 2403:69244](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=2403-69244&m=dev)
- Search panel screenshots: 입력 1자 이상 dropdown, 외부 클릭 닫힘, 상품 없음, 상품 정보 load 실패 케이스
- Screen IDs: `2273:132751`, `2403:118466`, `2403:69244`
- Target viewport: desktop operation tool, sidebar layout 기준
- Existing route scaffold: DCMSM-15

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Sidebar/protected layout responsibility stays in `src/app/layouts/SidebarLayout.tsx` and
  `src/app/routes/ProtectedRoute.tsx`.
- Today-special and event-discount product summary cards use `packages/shared` `ProductCard`.
- Home-only hero/checkerboard stays page-local until reuse and final desktop design are confirmed.
- Home header uses the `market-owner` app-shared `DesktopHeader` with `variant="onlyHome"` and
  `showSearchBar={true}`.
- Header product search uses the `market-owner` app-shared `ProductSearchPanel` through
  `DesktopHeader.searchSlot`.
- Leaflet share card UI uses the `market-owner` app-shared `LeafletShareCard`.

## Scope

- 홈 상단 checkerboard/hero visual 영역을 구성합니다.
- `DesktopHeader`의 상품 검색 영역에 `ProductSearchPanel`을 배치합니다.
- hero checkerboard 영역 안에 quick action 카드 3개를 배치합니다.
- 오늘의 특가 상품 카드와 행사 할인 상품 카드를 `@dongchimi/shared` `ProductCard`와 page-local fixture
  데이터로 렌더링합니다.
- 오른쪽 전단 공유 카드를 `LeafletShareCard`로 구성합니다.
- 공유 카드에는 공유 링크, 링크 복사 액션, 매장 고유 QR코드 보기 액션을 노출합니다.
- sidebar `홈` active state와 protected layout 안 렌더링을 유지합니다.
- `HomePage` 구현 범위와 미확정 flow를 이 spec에 동기화합니다.

## Out Of Scope

- 실제 상품 API, query key, cache invalidation
- 실제 검색 결과 API
- 상품 수정 페이지에서 `location.state.productId`를 소비해 특정 상품 form/modal을 여는 상세 동작
- QR 코드 실제 생성 또는 QR modal 구현
- 카카오/문자 실제 공유 연동
- 실시간 매장/계정 데이터 연동
- `MarketShareBottomSheet` client 리팩터
- `MarketShareBottomSheet`/`MarketShareContent` client 리팩터 또는 shared 추출은 모바일/데스크탑 공유
  콘텐츠가 실제로 동일하다고 확정되면 별도 spec/Jira 또는 별도 커밋으로 분리합니다.

## Layout And Sections

```text
HomePage(main)
  h1("동치미 홈", visually hidden)
  DesktopHeader(variant=onlyHome, showSearchBar=true, searchSlot=ProductSearchPanel)
  HomeHeroSection          // checkerboard visual
    HomeQuickButton * 3
  HomeDashboardSection
    HomeProductSummarySection
      ProductCard(today)
      ProductCard(period)
    LeafletShareCard
```

- `DesktopHeader`: app-shared header를 `onlyHome` 모드로 소비하고 상품 검색 slot에 `ProductSearchPanel`을
  노출합니다.
  page heading은 시각적으로 숨긴 `h1`으로 유지합니다.
- `ProductSearchPanel`: 한 글자 이상 입력 시 검색 dropdown을 열고, 결과 item 선택 시 상품 수정 route로
  이동할 수 있도록 page handler를 호출합니다.
- `HomeHeroSection`: radius 20px checkerboard hero surface와 quick action 카드를 담당합니다.
  - quick action의 오른쪽 mint 영역은 icon/PNG asset 확정 전 placeholder slot으로 유지합니다.
- `HomeQuickButton`: Figma `button_home quick` node `2403:69244` 기준의 312x74 quick button입니다.
- `HomeDashboardSection`: 2개 상품 카드와 공유 카드를 같은 responsive grid에 배치합니다.
- `HomeProductSummarySection`: shared `ProductCard` 오늘의 특가 상품 카드와 행사 할인 상품 카드를
  배치합니다.
- `LeafletShareCard`: 전단 공유 카드 heading, description, link field, action buttons를 담당합니다.

## Design System And Component Boundary

- design-system layout/components:
  - `Flex`, `Stack`, `Grid` 등 기존 layout primitive는 필요할 때 사용합니다.
  - `IconButton`, `Button`, generated icons는 공유 카드 액션에 맞으면 사용합니다.
- app shared components:
  - `DesktopHeader`
  - `ProductSearchPanel` via `DesktopHeader.searchSlot`
  - `SearchBar` via `ProductSearchPanel`
  - `Sidebar` and `SidebarLayout`
  - `LeafletShareCard`
- package shared components:
  - `ProductCard`
- page-local components:
  - `HomeHeroSection`
  - `HomeQuickButton`
  - `HomeDashboardSection`
  - `HomeProductSummarySection`
- not promoted:
  - `DesktopHeader`는 기존 `onlyHome`/`showSearchBar` 동작을 유지하고, 상품 검색 flow가 필요한 홈에서는
    `searchSlot`으로 `ProductSearchPanel`을 주입합니다.
  - 홈 checkerboard/hero visual은 현재 홈 전용입니다.
  - 공유 액션 content가 client/mobile과 실제로 동일하게 변한다고 확인되면 `packages/shared`
    `MarketShareContent` 추출을 별도 작업으로 검토합니다.

## States

- loading: 검색 loading은 이번 범위에서 다루지 않습니다.
- empty: fixture 기준 기본 상품 목록을 노출하고, 검색 결과가 없으면 검색 dropdown에 empty message를 표시합니다.
- error: 알 수 없는 route는 router fallback에서 처리합니다. 검색 결과에서 상품을 선택했지만 상품 정보를
  불러오지 못하면 상단 error toast로 `상품 정보를 불러오지 못했어요.`를 표시합니다.
- disabled: QR 보기 실제 API 동작은 후속 범위이며, 현재는 버튼 클릭 시 준비 중 toast를 표시합니다.
- selected / active: sidebar `홈` item은 현재 route에 `aria-current="page"`를 적용합니다.
- hover/focus: 검색 입력의 focus-visible 상태를 유지합니다. 검색 결과 item hover 시 해당 item button에
  focus를 이동합니다.

## Data

- query: none
- mutation: none
- fixture:
  - 오늘의 특가 상품 카드와 행사 할인 상품 카드에 들어갈 상품 목록
  - 각 카드의 `itemVariant`, `totalCount`, edit route
  - 검색 dropdown에 사용할 상품명, 구분 label, 등록일, edit route, 상품 정보 load 가능 여부
  - hero quick action title, description, route
  - 전단 공유 링크와 공유 설명 copy
- model: none

## Behavior

- `/` route가 protected sidebar layout 안에서 홈 UI를 렌더링합니다.
- hero quick action은 오늘의 특가 등록, 행사 할인 등록, 상품 수정 route로 이동합니다.
- 상품 카드 row를 클릭하면 해당 카드 종류의 수정 route로 이동하고, route state에 `productId`를 전달합니다.
  수정 페이지에서 이 state를 실제 row focus/form open에 사용하는 동작은 후속 수정 페이지 범위입니다.
- `등록한 상품 전체보기` action은 `ProductCard`의 desktop actionSlot으로 주입하고, 오늘의 특가 상품
  카드는 `[오늘의 특가 상품] 수정하기` route, 행사 할인 상품 카드는 `[행사 할인 상품] 수정하기` route로
  이동합니다.
- 링크 복사는 clipboard 성공 시 `전단 링크가 복사되었습니다.` completed toast를 표시합니다.
- 링크 복사 실패 또는 clipboard 미지원 시 `링크를 복사하지 못했습니다. 다시 시도해주세요.` error toast를 표시합니다.
- QR 보기 클릭은 QR 표시 API/flow가 확정되기 전까지 `QR코드 보기 기능은 준비 중입니다.` completed toast를 표시합니다.
- toast는 홈 본문 스크롤 위치와 무관하게 viewport 상단 20px 아래에 표시합니다.
- 상품 검색은 한 글자 이상 입력 시 dropdown을 열고, 검색창과 dropdown 사이 gap은 4px입니다.
- 검색 결과는 일치도 높은 순으로 표시하고, 동일한 일치도는 최신 등록순으로 표시합니다.
- 검색 dropdown은 4개 기본 노출, 4개 초과 시 scroll 영역으로 전환하며 최대 10개까지만 렌더링합니다.
- 검색 dropdown 외부 영역을 클릭하면 dropdown을 닫습니다.
- 검색 결과 item을 클릭하면 상품 정보 load 가능 여부를 확인합니다.
- 상품 정보를 불러올 수 있으면 해당 fixture의 edit route로 즉시 이동하고, route state에 `productId`를 전달합니다.
- 상품 정보를 불러오지 못하면 route 이동 없이 `상품 정보를 불러오지 못했어요.` error toast를 표시합니다.

## Accessibility

- heading order: page root는 visually hidden `h1`으로 `동치미 홈`을 제공합니다.
- landmark: page root는 `main`으로 렌더링합니다.
- search: `ProductSearchPanel` 내부 검색 입력은 `role="search"`와 접근 가능한 이름을 유지합니다.
- hero quick actions: quick action 카드는 native `button`으로 렌더링하고 accessible name을 제공합니다.
- product cards: `ProductCard`의 section/list/button semantics를 유지합니다.
- product actions: `등록한 상품 전체보기`는 native `button`으로 렌더링하고 accessible name을 제공합니다.
- share actions: 링크 복사, QR 보기 액션은 native `button`으로 렌더링하고 accessible name을 제공합니다.
- toast: 링크 복사 성공 toast는 `role="status"`, 링크 복사 실패와 상품 정보 load 실패 toast는
  `role="alert"`로 노출합니다.
- keyboard: 검색 입력, 상품 row button, 공유 action button은 keyboard focus와 activation을 지원합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.
- current state: sidebar `홈` item은 현재 route에 `aria-current="page"`를 적용합니다.

## Responsive

- desktop: 첨부 이미지 기준 sidebar + content layout을 우선 구현합니다.
- content alignment: page root는 전체 inline padding을 갖지 않고, `DesktopHeader`와 home content
  section이 각각 Figma 기준 40px inline gutter를 갖습니다. header label/search와 hero/dashboard의
  시작점과 끝점은 같은 x축에 맞춥니다.
- section spacing: hero와 dashboard card 영역 사이 gap은 16px입니다.
- bottom spacing: 1440px x 900px Figma frame 기준 dashboard card 하단 여백은 26px입니다.
- hero: hero surface는 radius 20px, overflow hidden으로 checkerboard를 clipping합니다.
- dashboard cards: 오늘의 특가 상품, 행사 할인 상품, 전단 공유하기 카드는 같은 row에서 동일한 가변 폭을
  사용하고, 최소 폭 320px과 height 386px을 지킵니다.
- product summary cards: 오늘의 특가 상품과 행사 할인 상품의 상품 row는 56px로 동일하게 맞추고, action은
  카드 하단의 남은 세로 공간 중앙에 배치합니다.
- 1440px desktop: 상품 카드 2개와 공유 카드 1개가 같은 row에 3열로 배치됩니다. 각 카드는 남는 폭을
  균등하게 나눠 가져 첫 카드 시작선과 마지막 카드 끝선이 content gutter에 맞도록 합니다.
- narrow desktop: 3열을 유지할 수 없는 폭에서는 카드 최소 폭을 지키며 줄바꿈됩니다.
- search header: 좁은 폭에서는 제목과 검색 입력이 같은 header 안에서 줄바꿈됩니다.
- tablet/mobile: 이번 사장님 사이트 홈 범위에서 별도 최적화하지 않습니다.
- overflow: 상품명, 가격, 공유 링크, 검색 입력 placeholder가 부모 영역을 깨지 않도록 ellipsis 또는 min-width
  제약을 둡니다.

## Publishing Evidence

- Figma mismatch: Figma URL 또는 Screen ID가 확인되면 기록합니다.
- browser route: `/`
- viewport: desktop protected sidebar layout
- screenshot / preview: 구현 후 PR evidence에 첨부합니다.

## Verification

- [x] `/` route renders home page UI
- [x] route renders sidebar complementary landmark
- [x] sidebar `홈` link has `aria-current="page"`
- [x] hero quick action buttons render from fixture data
- [x] today-special and event-discount `ProductCard` sections render from fixture data
- [x] product row click navigates to each edit page
- [x] product summary action buttons navigate to each edit page
- [x] share card renders share URL, copy action, and QR action
- [x] link copy success shows completed toast
- [x] link copy failure shows error toast
- [x] QR code action shows preparing toast
- [x] search input is keyboard/focus accessible
- [x] search dropdown opens after one or more characters
- [x] search dropdown closes on outside click
- [x] search result click navigates to product edit route
- [x] search result product load failure shows error toast
- [x] `git diff --check`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test`
- [x] `pnpm --filter market-owner build`

## Open Questions

- 수정 페이지에서 `location.state.productId`를 소비하는 방식
- 실제 상품 검색 API와 상품 정보 load 실패 처리 위치
- QR 보기 실제 API와 modal 또는 route 연결 방식
- Figma URL 또는 Screen ID
