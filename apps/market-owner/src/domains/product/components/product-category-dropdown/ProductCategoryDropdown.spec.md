# Domain Component Spec: Product Category Dropdown

## Purpose

상품 등록·수정 화면에서 동일한 카테고리 trigger와 dropdown 목록 UI를 제공합니다.

## Components

- `ProductCategoryTrigger`: 공통 typography, 크기, padding, border, chevron을 제공합니다.
- `ProductCategoryDropdown`: 공통 카테고리 option 목록과 selected 상태를 제공합니다.

## Styling

- trigger는 다른 medium 입력 필드와 동일한 `body-3-medium`, 높이 `4rem`, 가로 padding `1.6rem`을 사용합니다.
- trigger 폭과 dropdown 위치는 각 field layout이 결정합니다.
- 등록 화면의 placeholder와 error border는 호출부 className으로 확장합니다.
- 호출부가 공통 layout hook으로 전달한 최대 높이를 적용하고, option 목록이 가용 높이를 넘으면 dropdown 내부를 세로 스크롤합니다.
- dropdown은 viewport 하단과 40px 간격을 확보할 수 있도록 최대 높이를 계산하며, 작은 viewport에서도 이 여백보다 최소 높이를 우선하지 않습니다.
- `renderInTopLayer`를 사용하면 native popover top layer에 표시해 modal의 overflow 경계에 잘리지 않고, 호출부가 전달한 fixed 위치와 최대 높이를 사용합니다.
- dropdown item은 `flex-shrink: 0`으로 고정해 스크롤 컨테이너에서도 `4rem` 높이를 유지합니다.
- dropdown item의 hover와 selected 상태는 모두 `semantic.primary.light` 배경과 `semantic.primary.strong` text를 사용합니다.

## Accessibility

- trigger는 native button이며 호출부가 `aria-expanded`, `aria-controls`, `aria-describedby`를 연결합니다.
- dropdown은 호출부가 전달한 accessible label과 id를 유지합니다.
