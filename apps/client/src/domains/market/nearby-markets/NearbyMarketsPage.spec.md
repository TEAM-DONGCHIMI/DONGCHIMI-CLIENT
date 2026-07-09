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
- 지도 위에 현재 위치 마커(커스텀 오버레이)와 주변 마트 마커(`MapMarker`)를 표시하고, 마트 마커를 터치하면 마트명을 보여주는 정보창을 노출합니다.
- `useNearbyMarketsInfiniteQuery`로 주변 마트 목록을 무한스크롤 방식으로 조회하여 `MartSummaryCard` 목록으로 표시합니다.
- 위치/마트 검색 input의 입력값을 `useDebouncedValue`로 debounce한 뒤 `keyword` 파라미터로 전달하여, 마트 이름/주소 기준으로 목록을 필터링합니다.
- 마트 카드 클릭 시 해당 마트의 `/markets/[marketId]` 상세 전단 route로 이동합니다.

## Out Of Scope

- 위치 기반 마트 목록 조회 (지도 중심은 geolocation 연동되었으나, 현재 mock API는 위치 파라미터 없이 keyword 필터만 지원합니다)
- 실제 백엔드 주변 마트 API 연동 (현재 `nearby-markets-api`는 mock 데이터를 반환하며, 백엔드 endpoint가 나오면 `httpClient.get` 호출로 교체합니다)
- bottom sheet (마커 터치 시에는 간단한 정보창만 노출하며, 별도 bottom sheet UI는 이후 작업에서 연결합니다)
- 위치 권한 상태에 따른 검색 input 기본 텍스트/placeholder 전환과, 권한 미허용 시 우편번호 찾기 모달을 통한 행정동 검색 플로우(화면설계서 placeholder/노출 규칙): 현재 placeholder는 고정 텍스트("서울시 마포구 망원동")이며, 이후 작업에서 연결합니다.

## Layout And Sections

- 앱 헤더
- `NearbyMarketsSearchSection`: 현재 위치 기준 타이틀, 위치/마트 검색 input
- `NearbyMarketsMapSection`: 지도 영역 (현재 위치 마커, 주변 마트 마커, 상태 안내 문구)
- `NearbyMarketsMarketListSection`: 무한스크롤 주변 마트 목록 (`MartSummaryCard`), 마트 상세 전단 진입

## States

- loading: 목록 최초 조회 중에는 "주변 마트를 불러오는 중이에요." 상태 메시지를 `role="status"`로 노출합니다.
- empty: 조회 결과가 없으면 "주변에 등록된 마트가 없어요." 메시지를 노출하며, 검색어가 입력된 상태에서 결과가 없으면 "'{검색어}'에 대한 검색 결과가 없어요." 메시지를 노출합니다.
- error: 조회 실패 시 에러 메시지를 `role="alert"`로 노출합니다.
- disabled: 현재 없음
- selected / active: 마트 마커를 터치하면 해당 마커에 마트명을 보여주는 정보창이 열리고, 같은 마커를 다시 터치하거나 지도의 다른 영역을 터치하면 닫힙니다.
- fetching next page: sentinel이 뷰포트에 들어오면 다음 페이지를 불러오고, 로딩 중에는 "마트를 더 불러오는 중이에요." 상태 메시지를 노출합니다.
- map loading: 카카오맵 SDK 로딩 중에는 지도 영역에 placeholder만 표시합니다(`role="img"`, 접근 가능한 이름: "지도를 불러오는 중이에요").
- map error: SDK 로딩 실패 또는 앱 키 누락 시 placeholder와 함께 "마트를 불러올 수 없어요" 상태 메시지를 `role="status"`로 노출합니다. 주변 마트 목록 조회(`useNearbyMarketsInfiniteQuery`) 자체가 실패한 경우도 동일한 문구를 노출합니다.
- geolocation permission denied: 위치 권한이 거부되면 지도는 기본 위치(서울시청)를 중심으로 표시하고, 현재 위치 마커 없이 "위치 검색 결과를 기준으로 마트를 보여드릴게요" 상태 메시지를 `role="status"`로 노출합니다.
- geolocation error (그 외): 조회 실패/미지원 시에도 지도는 기본 위치를 중심으로 표시하고, "마트를 불러올 수 없어요" 상태 메시지를 노출합니다.

## Behavior

- search input: 위치/마트 검색 영역은 `input type="search"`로 노출하며, `NearbyMarketsPage`가 입력값을 상태로 관리하는 controlled input입니다. 입력값은 `useDebouncedValue`(기본 지연 `300ms`)로 debounce한 뒤 `useNearbyMarketsInfiniteQuery`의 `keyword` 파라미터로 전달합니다. `keyword`가 바뀌면 query key가 바뀌어 첫 페이지부터 다시 조회합니다. 위치(행정동) 검색과 우편번호 찾기 모달 연동은 이후 작업에서 연결합니다.
- map center: `useGeolocation`(`navigator.geolocation.getCurrentPosition`)으로 현재 위치를 조회하여 지도 중심으로 사용하며, 조회 전/실패 시에는 기본 위치(서울시청, `{ lat: 37.5665, lng: 126.978 }`)를 사용합니다.
- map marker: 현재 위치가 있으면 `CustomOverlayMap`으로 현재 위치 마커를 표시합니다. `useNearbyMarketsInfiniteQuery({ keyword })`로 조회한(마트 목록 섹션과 동일한 keyword, react-query 캐시 공유) 마트마다 `MapMarker`를 표시하며, 마커를 터치하면 `MapInfoWindow`로 마트명을 보여주고, 같은 마커를 다시 터치하거나 지도의 다른 영역을 터치하면 닫힙니다. 카카오맵 SDK가 지도 좌측 하단에 저작권 표기("kakao")를 자동으로 표시합니다.
- market list: `useIntersectionObserver`로 목록 하단 sentinel을 감지해 다음 페이지를 자동으로 불러옵니다(무한스크롤).
- navigation: 마트 카드 클릭 시 `router.push`로 `/markets/[marketId]`로 이동합니다.
- form / validation: 요청 파라미터(`keyword`/`cursor`/`pageSize`)와 API 응답 모두 zod 스키마(`nearby-markets-schema`)로 검증합니다. 응답은 검증 후 view model로 매핑합니다.
- API: `useNearbyMarketsInfiniteQuery` → `getNearbyMarkets`(현재 mock)로 주변 마트 목록을 조회합니다. `keyword` 파라미터를 전달하면 mock 목록을 마트 이름/주소 기준(대소문자 무시)으로 필터링합니다.

## Accessibility

- 페이지 타이틀은 `h1`으로 제공합니다.
- 검색 영역은 keyboard focus 가능한 `input type="search"`로 제공합니다.
- 지도 placeholder는 `role="img"`와 접근 가능한 이름을 제공합니다.
- geolocation 실패/권한 거부 상태 메시지는 `role="status"`로 노출합니다.
- 마트 목록의 loading/empty/error 상태 메시지는 `role="status"` 또는 `role="alert"`로 노출합니다.
- 마트 카드 액션은 keyboard focus 가능합니다.
- 지도 마커는 카카오맵 SDK가 그리는 `img` 엘리먼트로, `title` 속성 외 별도의 접근 가능한 이름/키보드 포커스는 제공하지 않는 SDK 자체의 한계가 있습니다. 현재 위치 마커는 `role="img"`와 접근 가능한 이름("현재 위치")을 제공합니다.

## Responsive

- mobile: Figma 모바일 화면 기준입니다.
- tablet: 추후 layout 기준 확정이 필요합니다.
- desktop: 추후 layout 기준 확정이 필요합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client build`
- [x] browser route: `/markets` (Playwright로 지도 마커/정보창/위치 권한 거부 상태 확인)

## Open Questions

- 1차로 마트명/주소 keyword 필터를 연결했습니다. 위치 권한 상태에 따른 검색 input 기본 텍스트 전환과 우편번호 찾기 모달을 통한 행정동 검색 플로우는 외부 주소 검색 서비스 선정 및 현재 위치 reverse geocoding 소스 확정이 필요합니다.
