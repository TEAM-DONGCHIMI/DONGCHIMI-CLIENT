# Hook Spec: `useTodaySpecialImageUpload`

## Metadata

- Jira: `DCMSM-56`
- Related API: `DCMSM-50`
- Hook: `useTodaySpecialImageUpload`
- Owner: `apps/market-owner/src/domains/product/today-special-registration/hooks`
- Status: Implemented

## Purpose

- 오늘의 특가 등록 form의 선택 이미지들을 Presigned URL 발급과 S3 PUT 순서로 업로드합니다.
- 페이지가 API helper와 S3 요청 세부사항을 직접 소유하지 않게 합니다.

## Inputs

- `uploadProductImages(products)`
  - `TodaySpecialProductFormTypes[]`

## Returns

- 각 상품 순서에 맞춘 `(string | null)[]`
- 이미지가 있으면 후속 상품 등록 payload에 사용할 `objectKey`를 반환합니다.
- 이미지가 없으면 `null`을 반환합니다.

## Behavior

- 상품 순서대로 이미지를 업로드합니다.
- 이미지가 없는 상품은 Presigned URL을 요청하지 않습니다.
- Presigned URL 발급에는 파일 MIME type과 byte 크기를 전달합니다.
- S3 PUT에는 API가 반환한 `requiredHeaders`를 그대로 전달합니다.
- Presigned URL 또는 S3 PUT 실패를 삼키지 않고 호출부로 전달합니다.

## API Contract

- Presigned URL: `POST /v1/uploads/presigned-url`
- Storage upload: Presigned `uploadUrl`에 `PUT`
- purpose: `PRODUCT_THUMBNAIL`
- cache invalidation: 없음
- optimistic update: 없음

## Constraints

- 상품 등록 API payload 조립과 제출은 소유하지 않습니다.
- 전체 submit pending 상태와 실패 toast는 오늘의 특가 등록 form/page가 소유합니다.

## Verification

- [x] `git diff --check`
- [x] hook unit test
- [x] page interaction test
- [x] market-owner lint/typecheck/build
- [x] API contract checked
- [x] Frontend Fundamentals / logic composition self-check
