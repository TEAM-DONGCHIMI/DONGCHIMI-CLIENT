# 상품 삭제 API

## 목적

사장님 상품 수정 화면에서 오늘의 특가와 행사 할인 상품의 개별 삭제 및 일괄 삭제 요청을 공통으로 처리합니다.

## API 계약

### 개별 삭제

- Method: `DELETE`
- Path: `/v1/owners/markets/{marketId}/products/{productId}`
- Path parameters: `marketId: number`, `productId: number`
- Request body: `{ forceDelete: boolean }`

### 일괄 삭제

- Method: `DELETE`
- Path: `/v1/owners/markets/{marketId}/products`
- Path parameter: `marketId: number`
- Request body: `{ productIds: number[], forceDelete: boolean }`

## 응답과 오류

- 성공 응답은 `success: true`, `code: SUCCESS`, `message` 계약을 검증합니다.
- `UNAUTHORIZED`, `FORBIDDEN_MARKET_ACCESS`, `MARKET_NOT_FOUND`, `PRODUCT_NOT_FOUND` 오류는 `httpClient`가 `ApiError`로 정규화한 상태를 유지합니다.
- 일괄 삭제의 `PRODUCT_NOT_FOUND` 응답에 포함될 수 있는 `data.notFoundIds`는 `ApiError.details`에서 확인할 수 있습니다.

## 상태 동작

- mutation 성공 후에만 화면의 로컬 상품 목록을 제거합니다.
- 삭제 확인 modal의 `삭제하기`를 누르면 개별/일괄 삭제 모두 `forceDelete: true`로 요청합니다.
- mutation 실패 시 기존 상품 목록과 일괄 선택 상태를 유지하고 오류 toast를 표시합니다.
- 요청 중에는 추가 삭제 요청을 비활성화합니다.

## 검증

- 개별 삭제 endpoint와 path parameter 전달
- 일괄 삭제 endpoint와 `productIds` body 전달
- 성공 응답 schema 검증
- HTTP client 오류 전달
