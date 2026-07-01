# Nearby Markets Page Spec

## Metadata

- Jira: DCMCL-2
- Screen ID: 모바일 웹 사용자측 와이어프레임 내 주변 마트 화면
- Route: `/markets`
- Owner: apps/client
- Status: Implemented

## Purpose

- 로그인 후 첫 화면으로, 현재 위치 기반 주변 마트를 지도와 목록으로 탐색합니다.

## Source Of Truth

- Figma: 첨부 와이어프레임 이미지
- FRS / SRS: 없음
- Decision / Meeting note: DCMCL-2 본문
- Related Jira: DCMCL-2

## Scope

- `/markets` route entry와 `NearbyMarketsPage` domain page shell을 제공합니다.
- 마트 상세 전단 route인 `/markets/[marketId]`로 이동할 수 있는 placeholder link를 둡니다.

## Out Of Scope

- geolocation permission 요청
- 지도 SDK 연동
- 주변 마트 API 조회
- 지도 marker, bottom sheet, 검색 UI 구현

## Layout And Sections

- 현재 위치 안내
- 지도/목록 영역 placeholder
- 마트 전단 진입 link

## States

- loading: 위치/API 연동 시 후속 처리
- empty: 주변 마트 없음 상태는 후속 처리
- error: 위치 권한 거부/API 실패는 후속 처리
- disabled: 없음
- selected / active: 지도 marker 선택은 후속 처리

## Behavior

- navigation: 마트 전단 link는 `/markets/[marketId]`로 이동합니다.
- interaction: 지도 marker, 목록 card interaction은 후속 이슈에서 구현합니다.
- form / validation: 없음
- API: 없음

## Accessibility

- keyboard: 전단 진입 link는 keyboard focus가 가능합니다.
- focus: 기본 focus style을 제거하지 않습니다.
- accessible name: 화면 제목은 `내 주변 마트`입니다.

## Responsive

- mobile: 모바일 웹 지도/목록 화면 기준
- tablet: 후속 layout 기준 확정 필요
- desktop: 후속 layout 기준 확정 필요

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
- [ ] browser route: `/markets`

## Open Questions

- 최종 화면명을 `홈`, `내 주변 마트`, `마트 찾기` 중 무엇으로 둘지 제품 IA 확정이 필요합니다.
