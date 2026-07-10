# Domain Component Spec: `ProductEditModal`

## Purpose

`ProductEditModal`은 상품 수정 카드의 개별 수정 버튼에서 열리는 판매 정보 수정 modal입니다.
디자인시스템 `Dialog`를 modal base로 사용하고, 오늘의 특가와 행사 할인의 입력 차이만 variant로 분기합니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/product-edit-modal`
- 사용처: `ProductEditProductList`
- product edit page 전용 form이므로 design-system이나 shared component로 승격하지 않습니다.

## Public API

- `open`: OverlayKit controller가 전달하는 modal open 상태입니다.
- `product`: 수정할 카드 상품 props입니다. 열릴 때 form 초기값으로 사용합니다.
- `variant`: `todaySpecial` 또는 `eventDiscount`로 가격/기간 입력 구성을 결정합니다.
- `onClose`: OverlayKit `close`/`unmount` 흐름으로 modal을 닫는 handler입니다.

## UI States

- default: 상품 카드 값으로 form을 채우고 `변경하기`는 disabled입니다.
- category dropdown: 상품 구분 trigger를 누르면 `Dropdown`으로 카테고리 옵션을 표시합니다.
- edited: 입력값 또는 카테고리/기간이 초기값과 달라지면 `변경하기`를 활성화합니다.
- submitted: 현재 API가 없으므로 `변경하기` 클릭 시 modal을 닫습니다.

## Behavior

- 수정 버튼 클릭은 `ProductEditProductList`가 `openProductEditModal`을 호출하고, helper가 `overlay.open`으로 선택 상품 modal을 엽니다.
- 취소는 modal을 닫고 form state를 버립니다.
- 행사 할인 variant는 판매가, 시작일, 종료일을 표시합니다.
- 오늘의 특가 variant는 원가, 오늘의 특가, 시작일, 종료일, `하루 더 늘리기` 버튼을 표시합니다.
- 오늘의 특가 variant는 현재 시작일을 회색 비활성 필드로 표시합니다.
- `하루 더 늘리기`는 종료일을 하루 증가시키고 버튼을 `오늘만 특가로`로 전환합니다.
- `오늘만 특가로`는 종료일을 시작일로 되돌립니다.
- 카드의 dotted date label은 modal input용 `YYYY-MM-DD` 형식으로 변환합니다.
- 텍스트/가격 입력은 design-system `InlineField`를 사용하고, 날짜 입력은 product domain 공용 `DateField`를 사용합니다.
- 상품 이미지 영역은 product domain 공용 `ProductImageUploadField`를 사용합니다.

## Accessibility

- `Dialog.Title`을 사용해 dialog accessible name을 제공합니다.
- 취소/변경하기는 native button semantics를 유지합니다.
- 상품 구분 trigger는 `aria-expanded`로 dropdown open 상태를 제공합니다.

## Verification

- [x] product card edit action opens dialog
- [x] opened dialog renders selected product values
- [ ] category dropdown changes selected category
- [x] today special one-day extension updates end date and can restore today-only date
