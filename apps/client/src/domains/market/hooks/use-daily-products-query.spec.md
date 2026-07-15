# Hook Spec: `useDailyProductsQuery`

## Metadata

- Jira: `DCMCL-21`
- App: `client`
- Domain: `market`
- Hook: `useDailyProductsQuery`
- Owner: client market domain
- Status: Implemented

## Purpose

- 마트 상세 응답에서 얻은 숫자 `marketId`로 오늘의 특가 전체 목록을 조회합니다.
- 공개 URL의 `slug`와 백엔드 리소스 식별자인 `marketId`를 혼용하지 않습니다.

## Source Of Truth

- API doc / OpenAPI: `GET /v1/users/markets/{marketId}/products/daily`
- Swagger evidence: 2026-07-15 `marketId=2` 성공 응답과 data 필드 캡처
- Related page/component: `market-products/TodaySpecialProductsSection`
- Related Jira: `DCMCL-18`, `DCMCL-20`, `DCMCL-21`

## Inputs

- `params.marketId: number`: 마트 상세 조회 응답의 양의 정수 식별자
- options: 없음
- external state: 없음

## Returns

- data: `{ totalCount, products }`
- status/actions/errors: TanStack Query query result를 그대로 반환합니다.

## API Contract

- browser endpoint: `GET /api/markets/products/daily?marketId={marketId}`
- backend endpoint: `GET /v1/users/markets/{marketId}/products/daily`
- method: `GET`
- params: BFF search parameter의 `marketId`, backend path의 `marketId`
- response: `totalCount`와 `productId`, `name`, nullable `thumbnailUrl`, `originalPrice`, `discountedPrice`, `discountRate`를 가진 `products`
- invariant: pagination 없는 전체 목록이므로 `totalCount`는 `products.length`와 일치해야 합니다.
- error: browser client가 정규화한 API 오류 또는 response validation 오류를 노출합니다.

## Query Key

- factory: `marketQueryKeys.dailyProducts`
- response-changing params: `marketId`

## Behavior

- enabled: `marketId`가 양의 정수일 때만 조회합니다.
- loading: TanStack Query의 pending 상태를 노출합니다.
- success: 검증된 response의 `data`만 반환합니다.
- empty: `{ totalCount: 0, products: [] }`를 정상 성공 상태로 유지합니다.
- error: 오류와 `refetch`를 호출부에 노출합니다.
- retry: 앱 QueryClient 기본 정책을 따릅니다.
- side effects: 없음

## Constraints

- cache: 앱 기본 `staleTime`을 사용합니다.
- concurrency/cancellation: TanStack Query와 Ky 기본 동작을 사용합니다.
- accessibility impact: 사용처가 loading/empty/error 상태와 재시도 버튼의 accessible name을 제공합니다.
- Swagger 확인 값 `2`는 테스트 근거로만 사용하고 제품 코드에 고정하지 않습니다.
- 화면에서는 마트 상세 응답의 `marketId`를 사용합니다.

## Verification

- [x] `git diff --check`
- [x] Frontend Fundamentals self-check
- [x] Logic composition self-check
- [x] state transitions covered
- [x] API contract checked
- [x] query key includes response-changing params
