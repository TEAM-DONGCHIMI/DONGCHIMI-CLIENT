# Domain Component Spec: `ProductEditPageShell`

## Purpose

`ProductEditPageShell`은 사장님 상품 수정 페이지의 공통 상단 영역을 담당합니다.
오늘의 특가 수정과 행사 할인 수정 페이지가 같은 헤더, route tab, 일괄 작업 버튼, 정렬 필터를 공유하되, 실제 상품 목록 영역은 각 페이지가 children으로 소유합니다.
행사 할인 수정 페이지는 추가로 카테고리 필터를 제공합니다.
헤더 검색 영역은 상품 검색 API 결과를 표시하고, 선택한 상품의 할인 유형에 맞는 수정 route로 이동합니다.
각 page는 외부에서 전달된 `productId` search param을 소비해 개별 수정 modal을 엽니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/product-edit-page-shell`
- 사용처: `TodaySpecialEditPage`, `EventDiscountEditPage`
- product domain route/copy에 묶인 컴포넌트이므로 `packages/design-system`이나 app shared component로 승격하지 않습니다.
- route/copy/sort option 상수는 `ProductEditPageShell.constants.ts`가 소유합니다.
- header search UI는 app shared `ProductHeaderSearch`가 소유하고, product domain의
  `useProductSearchQuery` 결과를 전달받아 pending/empty/error 상태를 표시합니다.
- `ProductEditPageShell`은 debounce 검색어와 query 상태 조합, 선택 결과의 route 이동을 소유합니다.
- `dealType`별 수정 route와 `productId` search param 조립은 `shared/utils/product-edit-target-path.utils.ts`가
  소유합니다. 이 utility는 React navigation을 수행하지 않습니다.
- product category option 상수는 `domains/product/constants/product-category.ts`가 소유합니다.
- product category dropdown hook은 등록/수정 화면에서 함께 쓸 수 있도록 `domains/product/hooks/use-product-category-dropdown.tsx`가 소유합니다.
- category dropdown open/close 상태는 행사 할인 수정 페이지에서만 `overlay-kit`의 overlay data에서 파생합니다.
- category dropdown UI는 design-system `Dropdown`과 `Dropdown.Item`을 사용하며 inline style을 사용하지 않습니다.

## Props

- `activeType`: `todaySpecial | eventDiscount`
- `children`: 현재 route의 상품 카드/list/table 영역. render function으로 전달하면 filter 값과 bulk selection controls를 받습니다.
- `deletePending`: 삭제 mutation 중 관리 action을 비활성화하는 상태
- `onDeleteProducts`: 일괄 삭제 확인 modal에서 선택된 상품 ID를 전달하고 성공 여부를 반환하는 handler
- `onResetProducts`: 초기화 확인 modal에서 확인을 누르면 현재 할인 유형의 상품을 초기화하고 성공 여부를 반환하는 handler
- `onUpdateProductPeriods`: 기간 일괄 수정 modal에서 변경을 확정하면 선택된 상품들의 기간을 수정하는 handler
- `periodBaseProduct`: 선택 상품이 없을 때 일괄 기간 수정 modal의 기본 기간으로 사용할 현재 목록의 기준 상품
- `productCounts`: 오늘의 특가/행사 할인 탭별 등록 상품 수. 0인 탭은 disabled 처리합니다.

## Behavior

- `activeType`에 따라 heading, breadcrumb current label, selected tab을 바꿉니다.
- 헤더 상품 검색은 trim된 검색어가 비어 있지 않을 때
  `GET /v1/owners/markets/{marketId}/products/search?keyword={keyword}&size=10`을 호출합니다.
- 검색 결과는 서버 응답 순서를 유지하고, 200 `products: []`는 empty 상태로 표시합니다.
- 검색 API 오류는 현재 route를 유지하고 검색 패널 error 상태로 표시합니다.
- 헤더 검색에서 상품을 선택하면 `DAILY`는 오늘의 특가 수정 route, `PERIODIC`은 행사 할인 수정 route로
  `productId` search param을 붙여 이동합니다.
- tab은 상품이 있는 경우 `TabNav.Item as={Link}`로 렌더링해 `/products/today-special/edit`, `/products/event-discount/edit` 사이를 route 이동합니다.
- 등록 상품 수가 0인 tab은 disabled item으로 렌더링해 route 이동을 막습니다.
- `카테고리별` filter는 행사 할인 수정 페이지에만 노출되며, trigger 아래에 category dropdown을 엽니다.
- category dropdown이 열려 있으면 trigger icon은 chevron up, 닫혀 있으면 chevron down을 표시합니다.
- dropdown open/close는 `overlay.open`, `overlay.close`, `overlay.unmount`로 처리하고, 바깥 클릭 또는 Escape 입력 시 닫습니다.
- 카테고리 trigger를 클릭하는 것만으로는 상품 목록 grouping을 바꾸지 않고, dropdown option을 선택한 뒤 `카테고리별` selected 상태와 카테고리별 목록을 표시합니다.
- 카테고리 trigger label은 카테고리 선택 전에는 `카테고리별`, 선택 후에는 선택된 카테고리 이름을 표시합니다.
- 행사 할인 filter pill button은 `카테고리별`, `상품 등록 순`, `조회수 순` 중 하나만 selected 상태로 표시합니다.
- 오늘의 특가 filter pill button은 `상품 등록 순`, `조회수 순` 중 하나만 selected 상태로 표시합니다.
- 기본 selected 상태는 행사 할인 수정 페이지에서는 `카테고리별`, 오늘의 특가 수정 페이지에서는 `상품 등록 순`이며, 사용자가 선택한 항목을 filled 상태와 `aria-pressed`로 표시합니다.
- breadcrumb header와 상단 control 영역은 scroll container 안에서 함께 고정되어 상품 목록 스크롤 중에도 유지됩니다.
- 일괄 기간 수정 버튼을 처음 누르면 bulk period selection mode에 진입하고 `선택된 상품 (0)`을 표시합니다.
- 선택된 상품 수는 `semantic.primary.strong` 색상으로 강조합니다.
- bulk period selection mode에서 같은 버튼을 다시 눌렀을 때 선택 상품이 없으면 selection mode를 종료합니다.
- bulk period selection mode에서 선택 상품이 1개 이상이면 기간 일괄 수정 버튼을 강조 상태로 표시합니다.
- bulk period selection mode에서 선택 상품이 있으면 첫 번째 선택 상품의 기간을 기본값으로 전달해 `ProductEditPeriodModal`을 엽니다.
- 기간 수정 modal에서 변경을 확정하면 `onUpdateProductPeriods`를 호출하고 selection mode를 종료합니다.
- 오늘의 특가 기간 수정 modal은 시작일을 비활성 상태로 표시하고 `하루 더 늘리기` 버튼을 제공합니다.
- 행사 할인 기간 수정 modal은 시작일과 종료일을 모두 수정 가능하게 표시하고 `하루 더 늘리기` 버튼을 제공하지 않습니다.
- 일괄 삭제 버튼을 처음 누르면 bulk delete selection mode에 진입하고 `선택된 상품 (0)`을 표시합니다.
- bulk delete selection mode에서 같은 버튼을 다시 눌렀을 때 선택 상품이 없으면 selection mode를 종료합니다.
- bulk delete selection mode에서 선택 상품이 1개 이상이면 일괄 삭제 버튼을 강조 상태로 표시합니다.
- bulk delete selection mode에서 선택 상품이 있으면 `ProductEditConfirmModal action="delete"`를 열고, 확인 버튼을 누르면 선택 상품의 `productId[]`로 `onDeleteProducts`를 호출합니다.
- 일괄 삭제 성공 시 selection mode를 종료하고, 실패 시 선택 상태를 유지합니다.
- bulk action을 바꾸면 selection mode는 새 action 기준으로 다시 시작하고 선택 상품은 초기화합니다.
- 초기화 버튼을 누르면 `openProductEditConfirmModal`로 `ProductEditConfirmModal action="reset"`을 엽니다.
- 초기화 확인 modal의 확인 버튼을 누르면 `onResetProducts`를 호출하고, 성공 시 selection mode를 종료하며 실패 시 기존 상태를 유지합니다.
- 삭제 mutation 중에는 기간 일괄 수정, 일괄 삭제, 초기화 action을 비활성화합니다.
- `productId` search param 기반 개별 수정 modal open/close는 children 영역의 상품 목록 컴포넌트가 담당합니다.

## Accessibility

- page root는 visible `h1`을 제공합니다.
- selected route tab은 `aria-current="page"`를 제공합니다.
- category trigger는 dropdown open state를 `aria-expanded`로 제공합니다.
- category dropdown은 `Dropdown role="group"`으로 렌더링하고, 각 option UI는 `Dropdown.Item`의 selected state를 사용합니다.
- bulk selection count는 visible text로 표시해 선택 개수 변화를 확인할 수 있게 합니다.

## Verification

- [x] 현재 수정 페이지의 header search에서 다른 `dealType` 상품을 선택하면 해당 수정 route와
      `productId` search param으로 이동하고 개별 수정 modal을 엽니다.
- [x] 빈 검색어에서는 검색 API를 호출하지 않습니다.
- [x] header search API 오류는 현재 route를 유지하고 error 상태를 표시합니다.
