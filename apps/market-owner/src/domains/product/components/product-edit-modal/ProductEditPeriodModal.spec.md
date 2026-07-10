# Domain Component Spec: `ProductEditPeriodModal`

## Purpose

`ProductEditPeriodModal`은 상품 수정 화면 상단의 `기간 일괄 수정` 버튼에서 열리는 판매 기간 수정 modal입니다.
오늘의 특가와 행사 할인의 기간 입력 차이만 variant로 분기합니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/product-edit-modal/ProductEditPeriodModal.tsx`
- 사용처: `ProductEditPageShell`
- modal open/close는 `openProductEditPeriodModal` helper가 공통 overlay helper로 처리합니다.

## Public API

- `variant`: `todaySpecial | eventDiscount`로 시작일 disabled 여부와 기간 toggle 버튼 노출 여부를 결정합니다.
- `open`: OverlayKit controller가 전달하는 modal open 상태입니다.
- `onClose`: OverlayKit `close`/`unmount` 흐름으로 modal을 닫는 handler입니다.
- `openProductEditPeriodModal`: 호출부에서 variant만 전달하면 modal overlay helper로 modal을 엽니다.

## Behavior

- 제목은 `선택된 상품들의 판매 기간을 수정해주세요`를 표시합니다.
- 오늘의 특가 variant는 시작일을 비활성 상태로 표시하고 `하루 더 늘리기` 버튼을 표시합니다.
- `하루 더 늘리기`를 누르면 종료일을 하루 증가시키고 버튼을 `오늘만 특가로`로 전환합니다.
- `오늘만 특가로`를 누르면 종료일을 시작일로 되돌리고 다른 변경이 없으면 `변경하기`를 다시 disabled 처리합니다.
- 행사 할인 variant는 시작일과 종료일을 모두 수정 가능하게 표시하고 `하루 더 늘리기` 버튼을 표시하지 않습니다.
- 변경 전에는 `변경하기` 버튼을 disabled 상태로 표시합니다.
- 현재 API가 없으므로 `변경하기` 클릭 시 modal만 닫습니다.
