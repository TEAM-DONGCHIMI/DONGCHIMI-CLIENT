# Market Products Page Spec

## Metadata

- Jira: DCMCL-2
- Screen ID: 모바일 웹 사용자측 와이어프레임 전단 상품 목록 화면
- Route: `/markets/[marketId]`
- Owner: apps/client
- Status: Implemented

## Purpose

- 특정 마트의 전단 상품을 오늘의 특가와 기간 할인 목록으로 탐색합니다.

## Source Of Truth

- Figma: 첨부 와이어프레임 이미지
- FRS / SRS: 없음
- Decision / Meeting note: DCMCL-2 본문
- Related Jira: DCMCL-2

## Scope

- `/markets/[marketId]` route entry와 `MarketProductsPage` domain page shell을 제공합니다.
- 상품 상세 route인 `/markets/[marketId]/products/[productId]`로 이동할 수 있는 placeholder link를 둡니다.
- `marketId` route param을 page shell로 전달합니다.

## Out Of Scope

- 마트 상세 API 조회
- 상품 목록 API 조회
- 오늘의 특가/기간 할인 tab 또는 filter UI 구현
- 전화 문의, 전단 공유, QR 공유 dialog 구현

## Layout And Sections

- 마트 정보 영역 placeholder
- 오늘의 특가 목록 placeholder
- 기간 할인 목록 placeholder
- 상품 상세 진입 link

## States

- loading: API 연동 시 후속 처리
- empty: 상품 없음 상태는 후속 처리
- error: API 실패는 후속 처리
- disabled: 전화/공유 action 연동 시 후속 처리
- selected / active: filter 선택은 후속 처리

## Behavior

- navigation: 상품 상세 link는 `/markets/[marketId]/products/[productId]`로 이동합니다.
- interaction: 전화, 공유, filter, tab interaction은 후속 이슈에서 구현합니다.
- form / validation: 없음
- API: 없음

## Accessibility

- keyboard: 상품 상세 link는 keyboard focus가 가능합니다.
- focus: 기본 focus style을 제거하지 않습니다.
- accessible name: 화면 제목은 `마트 전단 상품`입니다.

## Responsive

- mobile: 모바일 웹 전단 목록 화면 기준
- tablet: 후속 layout 기준 확정 필요
- desktop: 후속 layout 기준 확정 필요

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
- [ ] browser route: `/markets/[marketId]`

## Open Questions

- 오늘의 특가와 기간 할인을 route로 나눌지, query/type/filter 상태로 둘지는 데이터 모델 확정 후 결정합니다.
