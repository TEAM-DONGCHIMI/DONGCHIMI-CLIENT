# Domain Component Spec: `ProductEditModal`

## Purpose

`ProductEditModal`은 상품 수정 카드의 개별 수정 버튼에서 열리는 판매 정보 수정 modal입니다.
디자인시스템 `Dialog`를 modal base로 사용하고, 오늘의 특가와 행사 할인의 입력 차이만 variant로 분기합니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/product-edit-modal/product-edit-form-modal`
- 사용처: `ProductEditProductList`
- product edit page 전용 form이므로 design-system이나 shared component로 승격하지 않습니다.

## Public API

- `open`: OverlayKit controller가 전달하는 modal open 상태입니다.
- `marketId`, `productId`: modal이 열린 뒤 상세 조회에 사용합니다.
- `product`: 수정 완료 후 목록의 기존 카드 상태와 병합할 상품 props입니다.
- `variant`: `todaySpecial` 또는 `eventDiscount`로 가격/기간 입력 구성을 결정합니다.
- `onClose`: OverlayKit `close`/`unmount` 흐름으로 modal을 닫는 handler입니다.
- `onSubmit`: 변경 확정 시 수정된 카드 값을 호출부로 전달하는 handler입니다.

## UI States

- loading: 상세 정보를 조회하는 동안 loading 안내를 표시합니다.
- error: 상세 조회 실패 안내와 재시도 버튼을 표시합니다.
- default: 상세 응답으로 form을 채우고 `변경하기`는 disabled입니다.
- category dropdown: 상품 구분 trigger를 누르면 `Dropdown`으로 카테고리 옵션을 표시합니다.
- edited: 입력값 또는 카테고리/기간이 초기값과 달라지면 `변경하기`를 활성화합니다.
- submitted: `변경하기` 클릭 시 수정된 카드 값을 `onSubmit`으로 전달하고 modal을 닫습니다.

## Behavior

- 수정 버튼 클릭은 `ProductEditProductList`가 `openProductEditModal`을 호출하고, helper가 `overlay.open`으로 선택 상품 modal을 엽니다.
- modal이 열리면 `marketId`, `productId`로 상품 상세 API를 호출하고 상품명, 이미지, 카테고리, 가격, 홍보글, 기간을 form 초기값으로 사용합니다.
- 취소는 modal을 닫고 form state를 버립니다.
- 행사 할인 variant는 판매가, 시작일, 종료일을 표시합니다.
- 오늘의 특가 variant는 원가, 오늘의 특가, 시작일, 종료일, `하루 더 늘리기` 버튼을 표시합니다.
- 오늘의 특가 variant는 현재 시작일을 회색 비활성 필드로 표시합니다.
- `하루 더 늘리기`는 종료일을 하루 증가시키고 버튼을 `오늘만 특가로`로 전환합니다.
- `오늘만 특가로`는 종료일을 시작일로 되돌립니다.
- 카드의 dotted date label은 modal input용 `YYYY-MM-DD` 형식으로 변환합니다.
- 편집 가능한 시작일 field는 오늘부터 선택할 수 있습니다.
- 종료일 field의 최소 날짜는 시작일과 오늘 중 더 늦은 날짜이며, 종료일이 시작일보다 이전이면 `변경하기`를 비활성화합니다.
- 상품명은 공백을 포함해 최대 15자, 상품 한줄 홍보글은 공백을 포함해 최대 25자까지 입력할 수 있습니다.
- 원가, 오늘의 특가, 판매가는 숫자만 입력할 수 있고 천 단위 콤마를 표시합니다.
- 카테고리 dropdown은 viewport 하단과 40px 간격을 유지하고, modal scroll 시 현재 trigger 위치를 기준으로 최대 높이를 다시 계산합니다.
- 텍스트/가격 입력은 design-system `InlineField`를 사용하고, 날짜 입력은 product domain 공용 `DateField`를 사용합니다.
- 상품 이미지 영역은 product domain 공용 `ProductImageUploadField`를 사용합니다.

## Accessibility

- `Dialog.Title`을 사용해 dialog accessible name을 제공합니다.
- modal 최초 진입 시 특정 제목/입력/button에 focus-visible 상태를 만들지 않고 dialog container에 focus를 둡니다.
- 취소/변경하기는 native button semantics를 유지합니다.
- 상품 구분 trigger는 `aria-expanded`로 dropdown open 상태를 제공합니다.

## Verification

- [x] product card edit action opens dialog
- [x] opened dialog renders selected product values
- [x] opened dialog renders product detail response values
- [x] category dropdown changes selected category
- [x] today special one-day extension updates end date and can restore today-only date
