# Daily Product Registration API Spec

## Purpose

오늘의 특가 상품 1개를 마트에 등록합니다.

## Endpoint

- Method: `POST`
- Path: `/v1/owners/markets/{marketId}/products/daily`
- Endpoint helper: `API_ENDPOINTS.owner.products.daily(marketId)`

## Request

- Generated type: `OwnerApiTypes.DailyProductRegisterRequest`
- `thumbnailUrl`: 선택 이미지가 있으면 Presigned 업로드 결과의 `objectKey`, 이미지가 없으면 기본 이미지 `/images/product-replace.svg`
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
  "message": "요청에 성공했습니다.",
  "data": {
    "productId": 101,
    "name": "토마토",
    "dealType": "DAILY",
    "thumbnailUrl": "https://cdn.dongchimi.kr/products/101.png",
    "originalPrice": 5000,
    "discountedPrice": 4500,
    "category": "VEGETABLE_FRUIT",
    "categoryName": "채소/과일",
    "promotionalPhrase": "멋쟁이 토마토",
    "discountStartDate": "2026-06-30",
    "discountEndDate": "2026-06-30"
  }
}
```

등록 응답은 상품 상세 조회와 같은 `OwnerProductDetailResponse` 계약을 사용합니다. 공용 Zod schema로
`productId`, `thumbnailUrl`, 상품명, 판매 유형, 가격, 카테고리, 홍보 문구, 할인 기간을 검증합니다.
응답 `thumbnailUrl`은 브라우저에서 GET 가능한 영속 URL이어야 하며 상세 query cache와 후속 수정 payload에 저장합니다.
등록 세션 내 snapshot의 미리보기는 private 임시 URL에 의존하지 않도록 로컬 object URL을 유지합니다.

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
- Cache: 등록 성공 시 `productQueryKeys.listRoot` prefix를 invalidate하여 `DAILY`, `PERIODIC`
  목록 cache를 모두 stale 상태로 변경합니다. 목록 query가 다시 성공하면 `dataUpdatedAt`을
  기준으로 화면의 로컬 상품 state도 최신 응답으로 초기화합니다.
- Cache seed: 등록 응답 전체를 `productQueryKeys.detail({ marketId, productId })`에 저장해 등록 직후
  수정 모달 또는 상세 소비자가 추가 GET 없이 같은 서버 확정 데이터를 사용할 수 있게 합니다.

## Integration Gate

- `marketId`는 로그인 응답의 `OwnerLoginResponse.marketId`를 auth store에서 제공합니다.
- auth store에 `marketId`가 없으면 상품 등록 요청을 보내지 않고 마트 정보 등록 route로 이동합니다.
- 이미지가 있으면 기존 Presigned API와 S3 PUT 흐름을 재사용하고, OpenAPI `PresignedUploadResponse.objectKey`를 `thumbnailUrl`에 전달합니다.
- 등록 성공 후 서버용 snapshot에는 응답의 `data.thumbnailUrl`을 저장하고, 현재 등록 세션의 화면 미리보기는 로컬 object URL을 유지합니다.
- 등록 요청은 공개 URL을 직접 조합하지 않으므로 `VITE_PUBLIC_S3_BASE_URL`에 의존하지 않습니다.
- 이미지가 없으면 Presigned 요청을 생략하고 저장소의 기본 상품 이미지 `/images/product-replace.svg`를 `thumbnailUrl`에 전달합니다.

## Verification

- [x] API helper request/response test
- [x] mutation hook test
- [x] 등록 성공 후 `DAILY`, `PERIODIC` 상품 목록 query invalidation test
- [x] form-to-request mapper test
- [x] Presigned `objectKey`가 상품 등록 `thumbnailUrl`에 직접 연결되는 mapper/page test
- [x] 등록 payload의 `objectKey`, 응답 `thumbnailUrl`, 로컬 미리보기 분리 test
- [x] 이미지 미선택 시 기본 상품 이미지가 `thumbnailUrl`에 연결되는 mapper/page test
- [x] auth store의 실제 `marketId`로 page submit 연결
- [x] 등록 성공 응답의 전체 상품 상세 runtime validation
- [x] 등록 응답을 상품 상세 query cache와 등록 snapshot에 연결
- [x] 실제 session의 `marketId`로 연결
- [ ] 실제 서버 200/401/403/404 확인
