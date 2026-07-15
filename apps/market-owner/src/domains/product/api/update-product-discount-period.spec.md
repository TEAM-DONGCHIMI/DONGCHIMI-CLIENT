# API Spec: 상품 할인 기간 일괄 수정

## 목적

오늘의 특가와 행사 할인 수정 화면의 `기간 일괄 수정` 모달에서 선택한 상품들의 할인
시작일과 종료일을 한 번에 변경합니다.

## 계약

- Method: `PATCH`
- Endpoint: `/v1/owners/markets/{marketId}/products/discount-period`
- Path: `marketId: number`
- Request:
  - `discountStartDate: YYYY-MM-DD`
  - `discountEndDate: YYYY-MM-DD`
  - `productIds: number[]`
- Response: `SUCCESS` unit response

업데이트된 OpenAPI의 `ProductDiscountPeriodUpdateRequest`를 request type으로 사용하며,
선택 상품 ID는 `productIds`로 전송합니다.

## 상태와 동작

- 선택 상품이 없으면 요청하지 않습니다.
- 시작일이 종료일보다 늦거나 행사 할인 시작일이 오늘보다 이전이면 기존 모달 검증으로 제출을
  막습니다.
- pending 동안 취소와 변경 CTA를 비활성화하여 중복 제출을 막습니다.
- 성공하면 모달과 bulk selection mode를 닫습니다.
- 실패하면 별도 toast 없이 날짜 입력과 선택 상품을 유지합니다.
- 성공 후 상품 목록 전체와 선택 상품별 상세 query를 invalidate합니다.

## 검증

- API helper가 endpoint와 `productIds` body를 정확히 전달하는지 확인합니다.
- mutation 성공 후 목록과 선택 상품 상세 cache invalidation을 확인합니다.
- flow가 성공/실패와 선택 상품 없음 상태를 구분하는지 확인합니다.
- 모달이 성공할 때만 닫히고 pending 또는 실패 시 상태를 유지하는지 확인합니다.
