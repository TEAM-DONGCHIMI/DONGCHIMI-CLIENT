# usePeriodicProductsInfiniteQuery Spec

## Metadata

- Jira: DCMCL-20
- Owner: `apps/client/src/domains/market`
- Endpoint: `GET /v1/users/markets/{marketId}/products/periodic`

## Purpose

숫자 `marketId`와 선택 카테고리로 행사 할인 상품을 cursor 기반 조회한다.

## Public API

- 입력: `{ marketId: number; category?: PeriodicProductCategoryTypes; size?: number }`
- 반환: TanStack Query `useInfiniteQuery` 결과
- 첫 요청은 cursor를 생략하고 이후 요청은 직전 페이지의 `nextCursor`를 사용한다.

## Query Key

- `marketId`, `category`, 유효 `size`를 포함한다.
- 기본 `size`는 `12`로 정규화한다.
- cursor는 query key가 아니라 `pageParam`으로 관리한다.

## Validation And Error

- API helper가 path/query params를 Zod로 검증한다.
- 응답은 generated user API type과 연결된 Zod schema로 검증한다.
- `marketId`가 양의 정수가 아니면 query를 활성화하지 않는다.
- 인증, API 응답 검증 오류는 자동 재시도하지 않는다.

## Pagination

- `hasNext === true`이고 `nextCursor`가 숫자일 때만 다음 pageParam을 반환한다.
- `hasNext === false` 또는 `nextCursor === null`이면 조회를 종료한다.
- 서버가 이미 사용한 `nextCursor`를 다시 반환하면 반복 요청을 막고 조회를 종료한다.

## Verification

- shared endpoint query string 테스트
- API helper 성공, cursor, validation 테스트
- query key 기본값 및 next pageParam 테스트
- 화면의 category 전환, append, loading, empty, error/retry 테스트
