# Domain Component Spec: `ProductEditProductList`

## Purpose

`ProductEditProductList`는 사장님 상품 수정 화면에서 필터링된 상품 그룹을 렌더링하고, 상품이 없을 때 공통 `ProductEditEmptyView`로 위임합니다.
오늘의 특가 수정과 행사 할인 수정 페이지가 같은 empty 컴포넌트를 공유하되, 등록 CTA의 목적지는 각 페이지가 주입합니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/product-edit-product-list`
- 사용처: `TodaySpecialEditProductSection`, `EventDiscountEditProductSection`
- product domain route/copy에 묶인 컴포넌트이므로 design-system이나 app shared component로 승격하지 않습니다.
- empty UI는 `product-edit-empty-view/ProductEditEmptyView`가 소유합니다.
- 카드 props 변환과 grouping 로직은 `display-groups` 하위 helper가 소유합니다.

## Public API

- `ariaLabel`: 목록 또는 empty section의 accessible name입니다.
- `groups`: 렌더링할 상품 그룹입니다. 모든 그룹의 `products`가 비어 있으면 empty 상태를 표시합니다.
- `registrationHref`: empty CTA가 이동할 상품 등록 route입니다.

## UI States

- loading: 이번 컴포넌트 범위에서 다루지 않습니다.
- empty: 등록된 상품이 없으면 `ProductEditEmptyView`가 Figma `Image_empty`, 제목, 설명, `상품 등록하러 가기` link를 중앙에 표시합니다.
- error: 이번 컴포넌트 범위에서 다루지 않습니다.
- success: 상품이 있으면 그룹 제목과 상품 수정 카드를 grid로 표시합니다.

## Behavior

- 상품 존재 여부는 `groups.some(({ products }) => products.length > 0)`로 판단합니다.
- empty CTA는 native link로 렌더링해 오늘의 특가/행사 할인 등록 route로 이동합니다.
- 상품이 있는 그룹은 전달받은 순서를 유지하며, 카드의 accessible name은 주입된 `aria-label`을 우선 사용합니다.

## Accessibility

- root section은 `ariaLabel`을 accessible name으로 사용합니다.
- empty 이미지는 장식 이미지이므로 `alt=""`로 숨깁니다.
- empty 제목은 `h2`로 렌더링합니다.
- CTA는 link role과 visible label을 제공합니다.

## Verification

- [x] no products: empty title, description, registration link renders
- [ ] with products: grouped product cards render
