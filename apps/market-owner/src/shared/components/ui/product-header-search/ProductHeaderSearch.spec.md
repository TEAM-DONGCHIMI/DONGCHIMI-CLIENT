# Component Spec: `ProductHeaderSearch`

## Metadata

- Jira: DCMSM-38, DCMSM-73
- Path: `apps/market-owner/src/shared/components/ui/product-header-search/ProductHeaderSearch.tsx`
- Owner: market-owner shared UI
- Status: Implemented

## Purpose

`ProductHeaderSearch`는 사장님웹 헤더의 상품 검색 동작을 공통으로 조합합니다.
표현 UI는 `ProductSearchPanel`을 재사용하고, query debounce, API 상태 전달, 검색 결과 선택 전달을 담당합니다.
수정 route 생성과 navigation, 상품 상세 로드 실패 정책은 호출부가 소유합니다.

## Public API

- `products`: 상품 검색 API가 반환한 현재 검색 결과입니다. 전달받은 순서를 유지합니다.
- `onQueryChange`: debounce가 끝난 trim 검색어를 호출부에 전달합니다. 호출부는 이 값으로 product query를 실행합니다.
- `isPending`: debounce 또는 API 요청 대기 상태를 검색 패널에 전달합니다.
- `status`: API/response validation 오류를 검색 패널 error 상태로 전달합니다.
- `onSelectProduct`: 검색 결과에서 선택한 상품을 호출부에 전달합니다. 호출부는 route 이동, modal open, error feedback 같은 후속 정책을 결정합니다.

## Behavior

- 한 글자 이상 입력하면 `ProductSearchPanel` dropdown을 엽니다.
- debounce 반영 전 또는 API 요청 중에는 pending 상태를 전달합니다.
- trim된 검색어가 비어 있으면 `onQueryChange`에 빈 문자열을 전달하고 결과를 표시하지 않습니다.
- 상품명 검색과 정렬은 서버가 담당하며, `dealType`은 결과 chip과 수정 route 선택에만 사용합니다.
- 검색 결과를 선택하면 해당 `ProductHeaderSearchProductTypes`를 `onSelectProduct`에 전달합니다.
- 현재 검색 결과에서 상품을 찾지 못하면 선택 이벤트를 전달하지 않습니다.

## Accessibility

- 검색 input, dropdown list, pending/empty/error state의 semantics는 `ProductSearchPanel`과 `SearchBar` 계약을 따릅니다.

## Verification

- [x] selected search result is forwarded through `onSelectProduct`
- [x] home call site creates the edit route with the `productId` search param
- [x] product edit shell call site creates the edit route with the `productId` search param
- [x] debounced query is passed to the product search query call site
- [x] pending/empty/error states reflect the product search query
