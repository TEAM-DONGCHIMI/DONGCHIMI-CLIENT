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
- 현재 위치 기준 안내 타이틀과 위치/마트 검색 input을 표시합니다.
- 지도 SDK 연동 전까지 Figma 높이 기준의 지도 placeholder 영역을 표시합니다.
- 마트 상세 전단 route인 `/markets/[marketId]`로 이동 가능한 placeholder link를 둡니다.

## Out Of Scope

- geolocation permission 요청
- 지도 SDK 연동
- 주변 마트 API 조회
- 지도 marker, bottom sheet, 실제 검색 UI와 검색 결과 처리

## Layout And Sections

- 앱 헤더
- 현재 위치 기준 타이틀
- 위치/마트 검색 input
- 지도 영역 placeholder
- 마트 전단 진입 link

## States

- loading: 위치/API 연동 이후 처리합니다.
- empty: 주변 마트 없음 상태는 API 연동 이후 처리합니다.
- error: 위치 권한 거절/API 실패 상태는 이후 처리합니다.
- disabled: 현재 없음
- selected / active: 지도 marker 선택은 이후 처리합니다.

## Behavior

- search input: 위치/마트 검색 영역은 `input type="search"`로 노출하며, 실제 검색 동작은 이후 작업에서 연결합니다.
- navigation: 마트 전단 link는 `/markets/[marketId]`로 이동합니다.
- form / validation: 없음
- API: 없음

## Accessibility

- 페이지 타이틀은 `h1`으로 제공합니다.
- 검색 영역은 keyboard focus 가능한 `input type="search"`로 제공합니다.
- 지도 placeholder는 `role="img"`와 접근 가능한 이름을 제공합니다.
- 전단 진입 link는 keyboard focus 가능합니다.

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

- 검색 활성화 시 위치 검색, 마트명 검색, 주소 검색 중 어떤 플로우를 우선 노출할지 확정이 필요합니다.
