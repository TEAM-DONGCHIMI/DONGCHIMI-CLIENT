# Component Spec: `ProductHeaderSearch`

## Metadata

- Jira: DCMSM-38
- Path: `apps/market-owner/src/shared/components/ui/product-header-search/ProductHeaderSearch.tsx`
- Owner: market-owner shared UI
- Status: Implemented

## Purpose

`ProductHeaderSearch`는 사장님웹 헤더의 상품 검색 동작을 공통으로 조합합니다.
표현 UI는 `ProductSearchPanel`을 재사용하고, query debounce, pending 상태, 검색 결과 선택 후 상품 수정 route 이동을 담당합니다.

## Public API

- `products`: 검색 대상 상품 목록입니다. API 연동 전 fixture 또는 adapter 결과를 전달합니다.
- `getProductsByQuery`: 검색 소스를 교체할 수 있는 선택적 filter/adapter입니다. 기본값은 상품 구분 label과 상품명에 대한 부분 검색입니다.
- `onProductLoadError`: 선택 상품을 수정 화면으로 보낼 수 없을 때 호출합니다.

## Behavior

- 한 글자 이상 입력하면 `ProductSearchPanel` dropdown을 엽니다.
- debounce 반영 전에는 pending 상태를 전달합니다.
- `dealType === 'DAILY'`는 `/products/today-special/edit?productId={productId}`로 이동합니다.
- `dealType === 'PERIODIC'`은 `/products/event-discount/edit?productId={productId}`로 이동합니다.
- `isProductInfoLoadable === false`이거나 선택 상품을 찾지 못하면 이동하지 않고 `onProductLoadError`를 호출합니다.

## Accessibility

- 검색 input, dropdown list, pending/empty/error state의 semantics는 `ProductSearchPanel`과 `SearchBar` 계약을 따릅니다.
- 검색 결과 선택 후 열리는 수정 modal의 focus 이동은 상품 수정 modal 계약을 따릅니다.

## Verification

- [x] home header search result selects route with `productId` search param
- [x] selected edit page opens product edit modal from `productId`
- [x] load error path keeps current page and shows error feedback
