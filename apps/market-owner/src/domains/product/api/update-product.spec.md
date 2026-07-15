# Hook/API Spec: 상품 개별 수정

## Purpose

상품 카드의 `수정하기`로 여는 공용 `ProductEditModal`에서 오늘의 특가(`DAILY`)와
행사 할인(`PERIODIC`) 상품의 판매 정보를 서버에 반영합니다.

## API Contract

- Method: `PUT`
- Endpoint: `/v1/owners/markets/{marketId}/products/{productId}`
- Path params: `marketId`, `productId`
- Request:
  - 공통: `type`, `thumbnailUrl`, `name`, `category`, `promotionalPhrase`,
    `discountedPrice`, `discountStartDate`, `discountEndDate`
  - `DAILY`: `originalPrice` 포함
  - `PERIODIC`: `originalPrice` 미포함
- Response: `{ success: true, code: 'SUCCESS', message: string }`

## Flow

1. 모달은 상품 상세 조회 결과를 초기값으로 사용합니다.
2. 새 이미지가 선택되면 Presigned URL 발급과 S3 PUT을 완료한 뒤 public S3 URL을
   `thumbnailUrl`로 사용합니다.
3. 이미지가 변경되지 않으면 상세 응답의 기존 `thumbnailUrl`을 유지합니다.
4. 기존 상세 응답의 `dealType`을 요청 `type`으로 사용합니다.
5. PUT 성공 후 상품 목록과 해당 상품 상세 query를 invalidate합니다.
6. 성공한 경우에만 모달을 닫고 목록 카드 표시값을 갱신합니다.

## State And Error

- pending: `변경하기`를 비활성화해 중복 제출을 막습니다.
- success: 모달을 닫습니다.
- failure: 별도 toast 없이 모달 입력값을 유지합니다.
- cache: optimistic update 없이 성공 후 list/detail query를 invalidate합니다.
- retry: mutation retry를 추가하지 않습니다.

## Verification

- API helper의 endpoint, method, payload, response validation
- `DAILY`/`PERIODIC` request mapper
- mutation 성공 후 list/detail invalidation
- 공용 수정 모달의 성공/실패 및 중복 제출 방지
