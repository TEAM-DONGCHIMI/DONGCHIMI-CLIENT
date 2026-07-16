# Domain Component Spec: `ProductEditProductList`

## Purpose

`ProductEditProductList`는 사장님 상품 수정 화면에서 필터링된 상품 그룹을 렌더링하고, 상품이 없을 때 공통 `ProductEditEmptyView`로 위임합니다.
오늘의 특가 수정과 행사 할인 수정 페이지가 같은 empty 컴포넌트를 공유하되, 등록 CTA의 목적지는 각 페이지가 주입합니다.
상품 수정·삭제 modal과 route 기반 자동 열기는 `useProductEditListActions`가 소유하고, 목록은 전달받은 action만 카드에 연결합니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/product-edit-product-list`
- 사용처: `TodaySpecialEditProductSection`, `EventDiscountEditProductSection`
- product domain route/copy에 묶인 컴포넌트이므로 design-system이나 app shared component로 승격하지 않습니다.
- empty UI는 `product-edit-empty-view/ProductEditEmptyView`가 소유합니다.
- 카드 props 변환과 grouping 로직은 `display-groups` 하위 helper가 소유합니다.
- 개별 수정·삭제 modal과 자동 열기 side effect는 `use-product-edit-list-actions`가 소유합니다.

## Public API

- `ariaLabel`: 목록 또는 empty section의 accessible name입니다.
- `groups`: 렌더링할 상품 그룹입니다. 모든 그룹의 `products`가 비어 있으면 empty 상태를 표시합니다.
- `registrationHref`: empty CTA가 이동할 상품 등록 route입니다.
- `actions`: 카드 action 비활성화 상태와 수정·삭제 handler를 함께 전달합니다.
- `selection`: bulk selection 활성화 여부, 선택된 상품 ID, 선택 토글 handler를 함께 전달합니다.
- `pagination`: 다음 페이지 존재 여부, `idle`/`loading`/`error` 상태, 다음 페이지 조회 handler를 함께 전달합니다.
- category filter: 카테고리를 선택하기 전에는 상품을 카테고리 옵션 순서대로 그룹화해 표시하고, 카테고리를 선택한 뒤에는 해당 카테고리 상품만 표시합니다.

## UI States

- loading: 다음 페이지 조회 중 기존 카드를 유지하고 하단 로딩 문구를 표시합니다.
- empty: 등록된 상품이 없으면 `ProductEditEmptyView`가 `ImageEmpty` 일러스트, 제목, 설명, `상품 등록하러 가기` link를 중앙에 표시합니다.
- error: 다음 페이지 조회 실패 시 기존 카드를 유지하고 하단 오류 문구와 재시도 버튼을 표시합니다.
- success: 상품이 있으면 그룹 제목과 상품 수정 카드를 grid로 표시합니다.
- delete confirm: `useProductEditListActions`가 개별 상품 삭제 확인 modal을 표시하고, 목록에는 확인 흐름이 포함된 handler를 전달합니다.
- bulk selection: `selection.enabled`가 true이면 카드는 dimmed selectable 상태가 되고 선택된 상품은 check 상태로 표시합니다.

## Behavior

- 상품 존재 여부는 `groups.some(({ products }) => products.length > 0)`로 판단합니다.
- 상품 등록 순과 조회수 순 정렬은 `display-groups/create-product-edit-display-groups.ts`에서 공통으로 처리합니다.
- empty CTA는 native link로 렌더링해 오늘의 특가/행사 할인 등록 route로 이동합니다.
- 상품이 있는 그룹은 전달받은 순서를 유지하며, 카드의 accessible name은 주입된 `aria-label`을 우선 사용합니다.
- 카드 수정·삭제 버튼은 `actions.onEditProduct`, `actions.onDeleteProduct`를 호출하며 modal 제어를 직접 알지 않습니다.
- `useProductEditListActions`는 카드 클릭과 route 기반 자동 열기에 같은 수정 modal 흐름을 사용합니다.
- 자동으로 열린 modal이 닫히거나 대상 상품이 없을 때는 호출부가 전달한 callback을 실행합니다.
- bulk selection mode에서는 카드 수정/삭제 버튼을 disabled 처리하고, selection button만 `selection.onToggleProduct`로 동작합니다.
- `actions.disabled`이면 카드별 수정/삭제 버튼을 비활성화해 중복 요청을 막습니다.
- 다음 페이지가 있고 `pagination.status`가 `idle`이면 목록 하단 sentinel 진입 시 `pagination.onLoadNextPage`를 호출합니다.
- 다음 페이지 오류 상태에서는 observer 요청을 중단하고 사용자의 재시도 버튼 입력만 받습니다.

## Accessibility

- root section은 `ariaLabel`을 accessible name으로 사용합니다.
- empty 이미지는 장식 이미지이므로 `alt=""`로 숨깁니다.
- empty 제목은 `h2`로 렌더링합니다.
- CTA는 link role과 visible label을 제공합니다.
- bulk selection button은 `aria-pressed`로 선택 여부를 제공합니다.
- 다음 페이지 로딩 문구는 `role="status"`, 오류와 재시도 영역은 `role="alert"`를 사용합니다.

## Verification

- [x] no products: empty title, description, registration link renders
- [x] with products: grouped product cards render
- [x] edit action opens product edit modal
- [x] `autoOpenProductId` opens product edit modal
- [x] missing `autoOpenProductId` reports missing target
- [x] today special edit modal extends end date by one day
- [x] event discount edit modal hides one-day extension
- [x] bulk selection mode renders selectable cards and disables card actions
- [x] remaining-period delete action opens product delete confirm modal before delete
- [x] ended-period delete action also opens the product delete confirm modal
- [x] sentinel intersection requests the next page
- [x] next-page loading and retry states preserve rendered products
