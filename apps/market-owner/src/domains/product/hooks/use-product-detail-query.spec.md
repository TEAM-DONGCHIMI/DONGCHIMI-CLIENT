# Hook Spec: `useProductDetailQuery`

## Purpose

상품 수정 modal이 열릴 때 선택한 상품의 최신 상세 정보를 조회합니다.

## Contract

- endpoint: `GET /v1/owners/markets/{marketId}/products/{productId}`
- params: `marketId`, `productId`
- response type: OpenAPI `OwnerProductDetailResponse`
- validation: API boundary에서 Zod schema로 success response를 검증합니다.

## Cache

- static key: `productQueryKeys.detail`
- query options에서 `marketId`, `productId`를 결합해 상품별 cache를 분리합니다.
- query key factory는 사용하지 않습니다.

## Usage

- `ProductEditModal`이 열린 뒤 query를 실행합니다.
- pending 상태에는 loading 안내를, error 상태에는 재시도 UI를 표시합니다.
- success 상태에는 상세 응답으로 수정 form 초기값과 상품 이미지를 채웁니다.

## Verification

- [x] market와 product가 달라지면 query key가 분리된다
- [x] OpenAPI success contract와 다른 응답을 거부한다
- [x] 상세 응답으로 modal form 초기값을 구성한다
