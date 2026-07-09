# Nearby Markets Page Spec

## Metadata

- Jira: DCMCL-2
- Figma: APPJAM `2662:157119`, `2662:156977`
- Route: `/markets`
- Owner: apps/client
- Status: Implemented

## Purpose

- 로그인 후 첫 탐색 화면으로, 현재 위치 기반 주변 마트를 지도와 목록으로 탐색합니다.

## Source Of Truth

- Figma: APPJAM 주변 마트 화면
- Related Jira: DCMCL-2

## Scope

- `/markets` route entry와 `NearbyMarketsPage` domain page shell을 제공합니다.
- 상단에 공통 `MobileHeader`를 사용합니다.
- 화면 섹션은 `sections` 폴더의 page-local 컴포넌트로 분리합니다.
- 현재 위치 기준 안내 타이틀과 위치/마트 검색 input을 표시합니다.
- 카카오맵 SDK로 지도를 렌더링하고, `navigator.geolocation`으로 조회한 현재 위치를 지도 중심으로 사용합니다. SDK 로딩 전/실패 시에는 Figma 높이 기준의 placeholder 영역을 표시합니다.
- `useNearbyMarketsInfiniteQuery`로 주변 마트 목록을 무한스크롤 방식으로 조회하여 `MartSummaryCard` 목록으로 표시합니다.
- 마트 카드 클릭 시 해당 마트의 `/markets/[marketId]` 상세 전단 route로 이동합니다.

## Out Of Scope

- 위치 기반 마트 목록 조회 (지도 중심은 geolocation 연동되었으나, 현재 mock API는 위치 파라미터 없이 고정된 목록을 반환합니다)
- 실제 백엔드 주변 마트 API 연동 (현재 `nearby-markets-api`는 mock 데이터를 반환하며, 백엔드 endpoint가 나오면 `httpClient.get` 호출로 교체합니다)
- 지도 marker, bottom sheet, 실제 검색 UI와 검색 결과 처리

## Layout And Sections

- 앱 헤더
- `NearbyMarketsSearchSection`: 현재 위치 기준 타이틀, 위치/마트 검색 input
- `NearbyMarketsMapSection`: 지도 영역 placeholder
- `NearbyMarketsMarketListSection`: 무한스크롤 주변 마트 목록 (`MartSummaryCard`), 마트 상세 전단 진입

## States

- loading: 목록 최초 조회 중에는 "주변 마트를 불러오는 중이에요." 상태 메시지를 `role="status"`로 노출합니다.
- empty: 조회 결과가 없으면 "주변에 등록된 마트가 없어요." 메시지를 노출합니다.
- error: 조회 실패 시 에러 메시지를 `role="alert"`로 노출합니다.
- disabled: 현재 없음
- selected / active: 지도 marker 선택은 이후 처리합니다.
- fetching next page: sentinel이 뷰포트에 들어오면 다음 페이지를 불러오고, 로딩 중에는 "마트를 더 불러오는 중이에요." 상태 메시지를 노출합니다.
- geolocation error: 위치 권한 거부/조회 실패/미지원 시 지도는 기본 위치(서울시청)를 중심으로 표시하고, "현재 위치를 가져오지 못해 기본 위치를 표시하고 있어요." 상태 메시지를 `role="status"`로 노출합니다.

## Behavior

- search input: 위치/마트 검색 영역은 `input type="search"`로 노출하며, 실제 검색 동작은 이후 작업에서 연결합니다.
- map center: `useGeolocation`(`navigator.geolocation.getCurrentPosition`)으로 현재 위치를 조회하여 지도 중심으로 사용하며, 조회 전/실패 시에는 기본 위치(서울시청, `{ lat: 37.5665, lng: 126.978 }`)를 사용합니다.
- market list: `useIntersectionObserver`로 목록 하단 sentinel을 감지해 다음 페이지를 자동으로 불러옵니다(무한스크롤).
- navigation: 마트 카드 클릭 시 `router.push`로 `/markets/[marketId]`로 이동합니다.
- form / validation: API 응답은 zod 스키마(`nearby-markets-schema`)로 검증한 뒤 view model로 매핑합니다.
- API: `useNearbyMarketsInfiniteQuery` → `getNearbyMarkets`(현재 mock)로 주변 마트 목록을 조회합니다.

## Accessibility

- 페이지 타이틀은 `h1`으로 제공합니다.
- 검색 영역은 keyboard focus 가능한 `input type="search"`로 제공합니다.
- 지도 placeholder는 `role="img"`와 접근 가능한 이름을 제공합니다.
- geolocation 실패 상태 메시지는 `role="status"`로 노출합니다.
- 마트 목록의 loading/empty/error 상태 메시지는 `role="status"` 또는 `role="alert"`로 노출합니다.
- 마트 카드 액션은 keyboard focus 가능합니다.

## Responsive

- mobile: Figma 모바일 화면 기준입니다.
- tablet: 추후 layout 기준 확정이 필요합니다.
- desktop: 추후 layout 기준 확정이 필요합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client build`
- [ ] browser route: `/markets`

## Open Questions

- 검색 동작 연결 시 위치 검색, 마트명 검색, 주소 검색 중 어떤 플로우를 우선 노출할지 확정이 필요합니다.
