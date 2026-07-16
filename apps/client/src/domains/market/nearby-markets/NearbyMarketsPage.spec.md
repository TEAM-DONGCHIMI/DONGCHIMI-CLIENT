# Nearby Markets Page Spec

## Metadata

- Jira: DCMCL-2, DCMCL-26
- Figma: APPJAM `2662:157119`, `2662:156977`, `4279:53982`
- Route: `/markets`
- Owner: apps/client
- Status: Implemented

## Purpose

- 사용자의 현재 위치 또는 검색한 위치를 기준으로 주변 제휴 마트를 지도와 목록으로 탐색합니다.
- 목록에는 등록된 할인 상품이 있는 마트만 노출합니다.

## Scope

- `/markets` route entry는 `NearbyMarketsPage` domain page shell이 제공합니다.
- 공통 `MobileHeader`를 사용합니다.
- 위치 조회, 검색어 상태, query, 지도, 목록 interaction은 `NearbyMarketsClientProvider` 하위 클라이언트 boundary에서 처리합니다.
- 지도는 Kakao Maps SDK로 렌더링하고, 현재 위치 마커와 주변 마트 마커를 표시합니다.
- 마트 카드를 클릭하면 `/markets/[slug]` 상세 전단 route로 이동합니다.

## DCMCL-26 Empty State Update

- 등록된 마트가 없는 경우 지도 아래에 `img_empty` 아이콘을 91x91 크기로 노출합니다.
- 아이콘 아래 10px 간격으로 `주변에 제휴 마트가 없어요.\n더 많은 마트를 만나보실 수 있도록 준비중이에요!` 문구를 중앙 정렬로 표시합니다.
- 검색어가 있는 빈 결과는 기존 검색 결과 없음 문구를 유지합니다.
- 등록된 마트가 응답에 포함되더라도 `productCount`가 0이면 마트 리스트에는 노출하지 않습니다.
- 등록된 마트가 응답에 포함되더라도 `productCount`가 0이면 지도 마커도 노출하지 않습니다.
- 현재 로드된 페이지에 노출 가능한 마트가 없고 다음 페이지가 있으면 다음 페이지를 자동으로 이어서 조회합니다.

## Data

- 위치 기반 마트 목록 조회는 `nearby-markets-api`에서 same-origin `GET /api/markets/location` Route Handler를 호출합니다.
- Route Handler는 카카오 로그인으로 저장된 `access_token` cookie를 백엔드 `GET /v1/users/markets/location` endpoint에 전달합니다.
- 임시 테스트 인증이 필요한 경우 서버 환경변수 `API_TEST_TOKEN` 또는 기존 `NEXT_PUBLIC_API_TEST_TOKEN`을 fallback token으로 사용할 수 있습니다.
- `lat`, `lng`, `radius`, `cursor`, `size`를 query parameter로 전달합니다.
- 응답은 zod schema로 검증한 뒤 화면 모델의 `contents` 형태로 정규화합니다.
- 백엔드 contract에 맞춰 `thumbnailUrl`은 `string | null`을 허용합니다.

## Sections

- `NearbyMarketsSearchSection`: 현재 위치 기반 안내 타이틀과 위치/마트 검색 input
- `NearbyMarketsMapSection`: 지도 영역, 현재 위치 마커, 검색 위치 마커, 주변 마트 마커, 상태 안내 문구
- `NearbyMarketsMarketListSection`: 무한 스크롤 주변 마트 목록, 마트 상세 전단 진입

## States

- loading: 목록 최초 조회 중에는 `주변 마트를 불러오는 중이에요.` 상태 메시지를 `role="status"`로 노출합니다.
- empty: 노출 가능한 마트가 없으면 APPJAM 빈 상태 이미지와 안내 문구를 표시합니다.
- empty search: 검색어가 있는 빈 결과는 `'{검색어}'에 대한 검색 결과가 없어요` 문구를 표시하고 빈 상태 이미지는 표시하지 않습니다.
- fetching next page: 다음 페이지 조회 중에는 `마트를 더 불러오는 중이에요.` 상태 메시지를 표시합니다.
- error: 목록 조회 실패 시 `마트를 불러올 수 없어요.` 문구를 `role="alert"`로 노출하고 같은 문구의 error toast를 표시합니다.
- map loading: Kakao Maps SDK 로딩 중에는 `지도를 불러오는 중이에요` 접근 가능한 이름으로 placeholder를 표시합니다.
- map error: SDK 로딩 실패 또는 마트 조회 실패 시 `마트를 불러올 수 없어요` 상태 메시지를 표시합니다.
- geolocation permission denied: 위치 권한이 거부되면 지도는 기본 위치를 사용하고 `위치 검색 결과를 기준으로 마트를 보여드릴게요` 문구를 표시합니다.

## Behavior

- 검색 input은 `input type="search"`로 노출합니다.
- 사용자가 아직 입력하지 않았고 현재 위치가 있으면 기본 위치 문구 `서울시 마포구 망원동`을 표시합니다.
- 위치 권한이 거부된 경우 input 클릭으로 우편번호 검색을 열 수 있습니다.
- 우편번호 검색 결과가 선택되면 Kakao geocoder로 좌표를 변환하고 해당 좌표 기준으로 목록과 지도 마커를 다시 조회합니다.
- 마트 목록은 `useGetNearbyMarketsInfiniteQuery` 결과를 flatten한 뒤 `productCount > 0`인 마트만 전달합니다.
- 지도 마커도 marker query 결과 중 `productCount > 0`인 마트만 표시합니다.
- 마트 마커를 클릭하면 `MapInfoWindow`로 마트명을 보여주고, 같은 마커를 다시 클릭하거나 지도 다른 영역을 클릭하면 닫습니다.

## Accessibility

- 페이지 타이틀은 `h1`로 제공합니다.
- 검색 영역은 keyboard focus 가능한 `input type="search"`로 제공합니다.
- 지도 placeholder는 `role="img"`와 접근 가능한 이름을 제공합니다.
- 위치/지도/목록 상태 메시지는 `role="status"` 또는 `role="alert"`로 노출합니다.
- 마트 카드 action은 keyboard focus 가능합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client build`
- [x] `pnpm --filter client test -- NearbyMarketsMarketListSection`
