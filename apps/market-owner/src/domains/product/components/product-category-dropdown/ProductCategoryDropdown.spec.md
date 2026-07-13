# Domain Component Spec: Product Category Dropdown

## Purpose

상품 등록·수정 화면에서 동일한 카테고리 trigger와 dropdown 목록 UI를 제공합니다.

## Components

- `ProductCategoryTrigger`: 공통 typography, 크기, padding, border, chevron을 제공합니다.
- `ProductCategoryDropdown`: 공통 카테고리 option 목록과 selected 상태를 제공합니다.

## Styling

- trigger는 `body-2-medium`, 높이 `4rem`, 가로 padding `1.6rem`을 사용합니다.
- trigger 폭과 dropdown 위치·최대 높이는 각 field layout이 결정합니다.
- 등록 화면의 placeholder와 error border는 호출부 className으로 확장합니다.
- dropdown item은 `flex-shrink: 0`으로 고정해 스크롤 컨테이너에서도 `4rem` 높이를 유지합니다.
- dropdown item의 hover와 selected 상태는 모두 `semantic.primary.light` 배경과 `semantic.primary.strong` text를 사용합니다.

## Accessibility

- trigger는 native button이며 호출부가 `aria-expanded`, `aria-controls`, `aria-describedby`를 연결합니다.
- dropdown은 호출부가 전달한 accessible label과 id를 유지합니다.
