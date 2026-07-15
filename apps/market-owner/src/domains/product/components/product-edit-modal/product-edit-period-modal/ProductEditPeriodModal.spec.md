# Domain Component Spec: `ProductEditPeriodModal`

## Purpose

`ProductEditPeriodModal`은 상품 수정 화면 상단의 `기간 일괄 수정` 버튼에서 열리는 판매 기간 수정 modal입니다.
오늘의 특가와 행사 할인의 기간 입력 차이만 variant로 분기하고, 선택 상품의 기간 일괄 수정 API를 호출합니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/product-edit-modal/product-edit-period-modal/ProductEditPeriodModal.tsx`
- 사용처: `ProductEditPageShell`
- modal open/close는 `openProductEditPeriodModal` helper가 공통 overlay helper로 처리합니다.

## Public API

- `variant`: `todaySpecial | eventDiscount`로 시작일 disabled 여부와 기간 toggle 버튼 노출 여부를 결정합니다.
- `initialPeriod`: 호출부의 상품 목록 데이터에서 가져온 시작일/종료일 기본값입니다.
- `open`: OverlayKit controller가 전달하는 modal open 상태입니다.
- `onClose`: OverlayKit `close`/`unmount` 흐름으로 modal을 닫는 handler입니다.
- `onSubmit`: 변경 확정 시 선택 상품에 적용할 시작일/종료일 값을 호출부로 전달하는 handler입니다.
- `openProductEditPeriodModal`: 호출부에서 variant와 initialPeriod를 전달하면 modal overlay helper로 modal을 엽니다.
- `marketId`, `productIds`: 일괄 수정 API path와 body에 사용할 마트 및 선택 상품 ID입니다.

## Behavior

- 제목은 `선택된 상품들의 판매 기간을 수정해주세요`를 표시합니다.
- 시작일과 종료일 기본값은 고정 날짜가 아니라 호출부에서 전달한 상품 기간 데이터를 input 형식으로 변환해 사용합니다.
- 오늘의 특가 variant는 시작일을 회색 `readOnly` field로 표시하고, 종료일은 일반 field visual을 유지한 채 date picker만 열지 않으며 `하루 더 늘리기` 버튼으로만 기간을 변경합니다.
- `하루 더 늘리기`를 누르면 종료일을 하루 증가시키고 버튼을 `오늘만 특가로`로 전환합니다.
- `오늘만 특가로`를 누르면 종료일을 시작일로 되돌리고 다른 변경이 없으면 `변경하기`를 다시 disabled 처리합니다.
- 행사 할인 variant는 시작일과 종료일을 모두 수정 가능하게 표시하고 `하루 더 늘리기` 버튼을 표시하지 않습니다.
- 편집 가능한 시작일 field는 오늘부터 선택할 수 있습니다.
- 종료일 field의 최소 날짜는 시작일과 오늘 중 더 늦은 날짜이며, 종료일이 시작일보다 이전이면 `변경하기`를 비활성화합니다.
- 행사 할인 상품의 기존 시작일이 과거인 경우 기존 시작일을 유지한 종료일 변경은 허용하고, 시작일 자체를 변경할 때만 오늘 이후인지 검증합니다.
- 변경 전에는 `변경하기` 버튼을 disabled 상태로 표시합니다.
- modal 최초 진입 시 특정 제목/날짜 field/button에 focus-visible 상태를 만들지 않고 dialog container에 focus를 둡니다.
- pending 동안 취소와 `변경하기`를 비활성화해 중복 제출을 막습니다.
- `변경하기` 클릭 시 수정된 기간과 선택 상품 ID로 API를 호출하고 성공한 경우에만 modal을 닫습니다.
- API 실패 시 별도 toast 없이 입력 기간과 bulk selection 상태를 유지합니다.
