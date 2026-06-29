# Product Detail Page Spec

## Metadata

- Jira: DCMCL-2
- Screen ID: 모바일 웹 사용자측 와이어프레임 상품 상세 화면
- Route: `/markets/[marketId]/products/[productId]`
- Owner: apps/client
- Status: Implemented

## Purpose

- 특정 마트의 전단 상품 상세 정보를 확인합니다.
- 오늘의 특가와 기간 할인 상세 화면은 같은 route shell을 공유합니다.

## Source Of Truth

- Figma: 첨부 와이어프레임 이미지
- FRS / SRS: 없음
- Decision / Meeting note: DCMCL-2 본문
- Related Jira: DCMCL-2

## Scope

- `/markets/[marketId]/products/[productId]` route entry와 `ProductDetailPage` domain page shell을 제공합니다.
- `marketId`, `productId` route param을 page shell로 전달합니다.

## Out Of Scope

- 상품 상세 API 조회
- 오늘의 특가/기간 할인 상세 UI 차이
- 가격, 할인율, 기간, 재고, 안내 문구 UI 구현
- 구매, 전화, 공유 action 구현

## Layout And Sections

- 상품 이미지 영역 placeholder
- 상품 기본 정보 placeholder
- 가격/할인 정보 placeholder
- 안내 문구 placeholder

## States

- loading: API 연동 시 후속 처리
- empty: 상품 없음 또는 삭제 상태는 후속 처리
- error: API 실패는 후속 처리
- disabled: action 연동 시 후속 처리
- selected / active: 없음

## Behavior

- navigation: 전단 상품 목록 link는 `/markets/[marketId]`로 이동합니다.
- interaction: 상세 action은 후속 이슈에서 구현합니다.
- form / validation: 없음
- API: 없음

## Accessibility

- keyboard: 목록 복귀 link는 keyboard focus가 가능합니다.
- focus: 기본 focus style을 제거하지 않습니다.
- accessible name: 화면 제목은 `상품 상세`입니다.

## Responsive

- mobile: 모바일 웹 상품 상세 화면 기준
- tablet: 후속 layout 기준 확정 필요
- desktop: 후속 layout 기준 확정 필요

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
- [ ] browser route: `/markets/[marketId]/products/[productId]`

## Open Questions

- 할인 유형을 `productId` 데이터로 판별할지, query string으로 전달할지 후속 데이터 모델 확정이 필요합니다.
