# Domain Component Spec: `ProductEditPageShell`

## Purpose

`ProductEditPageShell`은 사장님 상품 수정 페이지의 공통 상단 영역을 담당합니다.
오늘의 특가 수정과 행사 할인 수정 페이지가 같은 헤더, route tab, 일괄 작업 버튼, 정렬 필터를 공유하되, 실제 상품 목록 영역은 각 페이지가 children으로 소유합니다.
행사 할인 수정 페이지는 추가로 카테고리 필터를 제공합니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/product-edit-page-shell`
- 사용처: `TodaySpecialEditPage`, `EventDiscountEditPage`
- product domain route/copy에 묶인 컴포넌트이므로 `packages/design-system`이나 app shared component로 승격하지 않습니다.
- route/copy/sort option 상수는 `ProductEditPageShell.constants.ts`가 소유합니다.
- product category option 상수는 `domains/product/constants/product-category.ts`가 소유합니다.
- product category dropdown hook은 등록/수정 화면에서 함께 쓸 수 있도록 `domains/product/hooks/use-product-category-dropdown.tsx`가 소유합니다.
- category dropdown open/close 상태는 행사 할인 수정 페이지에서만 `overlay-kit`의 overlay data에서 파생합니다.
- category dropdown UI는 design-system `Dropdown`과 `Dropdown.Item`을 사용하며 inline style을 사용하지 않습니다.

## Props

- `activeType`: `todaySpecial | eventDiscount`
- `children`: 현재 route의 상품 카드/list/table 영역

## Behavior

- `activeType`에 따라 heading, breadcrumb current label, selected tab을 바꿉니다.
- tab은 `TabNav.Item as={Link}`로 렌더링해 `/products/today-special/edit`, `/products/event-discount/edit` 사이를 route 이동합니다.
- `카테고리별` filter는 행사 할인 수정 페이지에만 노출되며, trigger 아래에 category dropdown을 엽니다.
- category dropdown이 열려 있으면 trigger icon은 chevron up, 닫혀 있으면 chevron down을 표시합니다.
- dropdown open/close는 `overlay.open`, `overlay.close`, `overlay.unmount`로 처리하고, 바깥 클릭 또는 Escape 입력 시 닫습니다.
- 카테고리 trigger를 클릭하는 것만으로는 상품 목록 grouping을 바꾸지 않고, dropdown option을 선택한 뒤 `카테고리별` selected 상태와 카테고리별 목록을 표시합니다.
- 카테고리 trigger label은 카테고리 선택 전에는 `카테고리별`, 선택 후에는 선택된 카테고리 이름을 표시합니다.
- 행사 할인 filter pill button은 `카테고리별`, `상품 등록 순`, `조회수 순` 중 하나만 selected 상태로 표시합니다.
- 오늘의 특가 filter pill button은 `상품 등록 순`, `조회수 순` 중 하나만 selected 상태로 표시합니다.
- 기본 selected 상태는 행사 할인 수정 페이지에서는 `카테고리별`, 오늘의 특가 수정 페이지에서는 `상품 등록 순`이며, 사용자가 선택한 항목을 filled 상태와 `aria-pressed`로 표시합니다.
- breadcrumb header와 상단 control 영역은 scroll container 안에서 함께 고정되어 상품 목록 스크롤 중에도 유지됩니다.
- 일괄 기간 수정, 일괄 삭제, 초기화는 이번 범위에서 레이아웃 button만 제공합니다.

## Accessibility

- page root는 visible `h1`을 제공합니다.
- selected route tab은 `aria-current="page"`를 제공합니다.
- category trigger는 dropdown open state를 `aria-expanded`로 제공합니다.
- category dropdown은 `Dropdown role="group"`으로 렌더링하고, 각 option UI는 `Dropdown.Item`의 selected state를 사용합니다.
