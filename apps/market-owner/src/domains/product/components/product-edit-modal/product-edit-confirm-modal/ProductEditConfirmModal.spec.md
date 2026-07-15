# Domain Component Spec: `ProductEditConfirmModal`

## Purpose

`ProductEditConfirmModal`은 상품 수정 화면에서 삭제 또는 초기화처럼 되돌리기 어려운 작업을 진행하기 전에 확인을 받는 modal입니다.
디자인시스템 `Dialog`를 modal base로 사용하고, action별 문구와 확인 버튼 label만 분기합니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/product-edit-modal/product-edit-confirm-modal/ProductEditConfirmModal.tsx`
- 사용처: `ProductEditProductList`, `ProductEditPageShell`, `TodaySpecialRegistrationPage`
- 상품 수정 화면 전용 확인 UI이므로 design-system이나 app shared component로 승격하지 않습니다.

## Public API

- `action`: `delete | reset`으로 제목 문구와 확인 버튼 label을 결정합니다.
- `open`: OverlayKit controller가 전달하는 modal open 상태입니다.
- `onCancel`: 취소, backdrop, Escape close에서 호출하는 handler입니다.
- `onConfirm`: 확인 버튼 클릭에서 호출하는 handler입니다.
- `isPending`: controlled 호출부의 mutation 진행 상태입니다. 진행 중에는 dismiss와 action 중복 실행을 막습니다.
- `title`: 특정 사용처에서 기본 action 제목을 대체하는 선택적 문구입니다.
- `openProductEditConfirmModal`: 호출부에서 action과 선택적 confirm handler만 전달하면 modal overlay helper로 modal을 엽니다.

## UI States

- delete: `행사 기간이 아직 남았어요. 정말 삭제하시겠어요?`, `삭제하기`를 표시합니다.
- today special registration delete: 기본 delete 제목을 `정말 삭제하시겠어요?`로 대체합니다.
- reset: `초기화하면 모든 상품이 삭제돼요. 정말 진행하시겠어요?`, `초기화하기`를 표시합니다.
- pending: 취소/확인 버튼을 비활성화하고 action별 `삭제 중` 또는 `초기화 중` 문구를 표시합니다.

## Behavior

- 호출부는 `openProductEditConfirmModal`을 호출하고, helper가 공통 overlay open/close handler를 연결합니다.
- OverlayKit helper 사용처는 확인 시 modal을 닫고 주입된 handler를 실행합니다.
- controlled 사용처는 mutation 성공 전 modal을 유지하고 `isPending`으로 중복 확인과 dismiss를 막을 수 있습니다.
- Dialog primitive의 backdrop click, Escape close, focus management를 그대로 사용합니다.
- modal 최초 진입 시 취소/확인 button에 focus-visible 상태를 만들지 않고 dialog container에 focus를 둡니다.

## Accessibility

- `Dialog.Title`을 사용해 dialog accessible name을 제공합니다.
- 취소/확인 action은 native button semantics를 유지합니다.

## Verification

- [ ] delete action renders delete confirmation copy
- [ ] reset action renders reset confirmation copy
- [ ] cancel and confirm close the overlay
