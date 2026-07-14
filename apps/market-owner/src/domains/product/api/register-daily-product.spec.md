# Daily Product Registration API Spec

## Purpose

오늘의 특가 상품 1개를 마트에 등록합니다.

## Endpoint

- Method: `POST`
- Path: `/v1/owners/markets/{marketId}/products/daily`
- Endpoint helper: `API_ENDPOINTS.owner.products.daily(marketId)`

## Request

- Generated type: `OwnerApiTypes.DailyProductRegisterRequest`
- `thumbnailUrl`: 선택 이미지가 있으면 `VITE_PUBLIC_S3_BASE_URL`과 Presigned 업로드 결과 `objectKey`를 결합한 절대 URL, 이미지가 없으면 기본 이미지 `/images/product-replace.svg`
- `name`: 앞뒤 공백을 제거한 상품명
- `category`: 화면의 한글 카테고리를 서버 enum code로 변환
- `promotionalPhrase`: 앞뒤 공백을 제거하고, 빈 값이면 생략
- `originalPrice`: 판매가
- `discountedPrice`: 오늘의 특가
- `discountStartDate`: 행사 시작일
- `discountEndDate`: 오늘의 특가는 현재 시작일과 같은 날짜로 전송

## Response

- Generated type: `OwnerApiTypes.RegisterDailyProductData`

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "요청에 성공했습니다."
}
```

응답 Zod schema는 `satisfies z.ZodType<OwnerApiTypes.RegisterDailyProductData>`로 OpenAPI 생성 타입과 구조를 맞추고, API boundary에서 `success: true`, `code: SUCCESS`, `message: string` 계약을 검증합니다.

## Errors

- `401 UNAUTHORIZED`
- `403 FORBIDDEN_MARKET_ACCESS`
- `404 MARKET_NOT_FOUND`
- network/timeout

`httpClient`가 오류를 `ApiError`로 정규화하고, 화면은 network 오류와 그 외 등록 실패를 구분해 안내합니다.

## Mutation

- Hook: `useDailyProductRegistrationMutation`
- Variables: `{ marketId, request }`
- Retry: 공통 mutation 기본값 사용
- Cache: 등록 성공 후 Home으로 이동하므로 현재 범위에서는 직접 cache update/invalidation을 추가하지 않습니다.

## Integration Gate

- `marketId`는 최종적으로 로그인 응답의 `OwnerLoginResponse.marketId`를 session에서 제공해야 합니다.
- 현재 로그인/session이 fixture이므로 page 호출부는 임시 `marketId = 1`을 사용하고 교체 위치에 TODO를 남깁니다.
- 이미지가 있으면 기존 Presigned API와 S3 PUT 흐름을 재사용하고, `VITE_PUBLIC_S3_BASE_URL`과 OpenAPI `PresignedUploadResponse.objectKey`를 결합한 절대 URL을 `thumbnailUrl`에 전달합니다.
- S3 base URL이나 object key 경계의 중복 slash는 제거하며, S3 base URL이 없으면 상대경로를 등록하지 않고 실패합니다.
- 이미지가 없으면 Presigned 요청을 생략하고 저장소의 기본 상품 이미지 `/images/product-replace.svg`를 `thumbnailUrl`에 전달합니다.

## Verification

- [x] API helper request/response test
- [x] mutation hook test
- [x] form-to-request mapper test
- [x] Presigned `objectKey`가 S3 절대 URL 형태로 상품 등록 `thumbnailUrl`에 연결되는 mapper/page test
- [x] S3 base URL 누락 시 상대경로를 등록하지 않는 mapper test
- [x] 이미지 미선택 시 기본 상품 이미지가 `thumbnailUrl`에 연결되는 mapper/page test
- [x] 임시 `marketId = 1`로 page submit 연결
- [ ] 실제 session의 `marketId`로 임시값 교체
- [ ] 실제 서버 200/401/403/404 확인
