# Hook Spec: `useMarketDetailQuery`

## Metadata

- Jira: DCMCL-18
- App: `client`
- Domain: `market`
- Status: Implemented

## Purpose

`GET /v1/users/markets/{slug}`의 마트 상세 정보를 TanStack Query로 조회합니다.

## Source Of Truth

- API: `GET /v1/users/markets/{slug}`
- Related page: `MarketProductsPage`
- Related Jira: DCMCL-18

## Inputs And Returns

- input: `{ slug: string }`
- data: `MarketDetailTypes` (`marketId`, 이름, 주소, 영업시간, 대표 전화번호, `top3`)
- status and actions: TanStack Query의 query result와 `refetch`

## API Contract

- browser endpoint: `GET /api/markets/{slug}`
- upstream endpoint: `API_ENDPOINTS.user.markets.detail(slug)`
- method: `GET`
- request: path parameter `slug`; browser는 server-side BFF route만 호출합니다.
- response: 성공 envelope의 non-null `data`를 `market-detail-schema.ts`에서 검증합니다. `businessHours[].days`는 Swagger의 `string[]` 계약을 보존합니다.
- query key: `marketDetailQueryKeys.query({ slug })`
- query options: `marketDetailQueryOptions({ slug })`가 query key와 query function을 함께 정의하고, hook은 실행 조건만 추가합니다.
- invalidation: read-only query이므로 없음

## Behavior

- 빈 slug에서는 query를 실행하지 않습니다.
- 네트워크와 서버 오류는 query error state로 전달합니다.
- schema validation 오류는 `ApiResponseValidationError`로 노출되며 retry하지 않습니다.
- auth/validation API 오류도 app QueryClient 기본 정책에 따라 retry하지 않습니다.
- 별도 cache duration이나 retry override는 추가하지 않고 app 기본값(`staleTime: 30초`)을 따릅니다.
- upstream API base와 테스트 token은 Route Handler의 server-only `API_BASE_URL`, `DEV_ACCESS_TOKEN`으로만 읽습니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client test`
- [ ] `pnpm --filter client build`
- [ ] slug path, response validation, loading/error/retry state coverage
