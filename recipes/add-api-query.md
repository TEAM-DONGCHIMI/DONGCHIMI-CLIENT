# Recipe: Add API Query Or Mutation

Use this when adding a query hook, mutation hook, endpoint helper, or API type.

Quality rule:

- `docs/code-quality/frontend-fundamentals.md`

## Steps

1. API contract를 확인합니다.
   - endpoint
   - method
   - request params/body
   - response shape
   - error shape when available
2. `templates/hook.spec.md` 기준으로 가장 가까운 spec을 작성 또는 갱신합니다.
3. owning location을 결정합니다.
   - Domain API: `apps/{app}/src/domains/{domain}/api`
   - Domain query/mutation hook: `apps/{app}/src/domains/{domain}/hooks`
   - Domain model/schema: `apps/{app}/src/domains/{domain}/model`
   - Domain query keys: `apps/{app}/src/domains/{domain}/query-keys.ts`
   - App shared API/query: base client와 provider만 `apps/{app}/src/shared/{api,query}`에 둠
   - Cross-app helper: real reuse가 생긴 뒤 `packages/shared`
4. 새 domain scaffold가 필요하면 matching generator를 사용합니다.

   ```bash
   pnpm gen:domain-query --args client <domain> <QueryName>
   pnpm gen:domain-mutation --args client <domain> <MutationName>
   ```

   `market-owner`는 API/query baseline이 준비되기 전까지 query/mutation generator 대상이 아닙니다. 먼저 `ky`, TanStack Query, `src/shared/api`, `src/shared/query` 기준을 별도 이슈에서 확정한 뒤 generator를 확장합니다.

5. request/response type은 작으면 API helper 가까이에 두고, page와 hook이 함께 쓰는 계약이면 `model/`로 분리합니다.
6. endpoint helper는 endpoint contract가 확인된 뒤 작성하고, `apps/{app}/src/shared/api`의 `httpClient`를 사용합니다.
7. query 또는 mutation hook에는 explicit query key를 둡니다.
8. response-changing params를 query key에 모두 포함합니다.
9. loading, error, empty, success 상태는 usage site에서 구분합니다.
10. cache invalidation은 mutation 성공 후 영향을 받는 query key 기준으로 명시합니다.
11. `setQueryData`는 서버 응답으로 캐시를 즉시 동기화할 수 있을 때만 사용합니다.
12. optimistic update는 rollback 기준과 실패 UX가 정리된 경우에만 사용합니다.
13. endpoint별 retry policy는 필요한 근거가 있을 때만 기본값을 override합니다.
14. Frontend Fundamentals 기준으로 API helper, query/mutation hook, usage site의 책임 분리와 예측 가능성을 self-check합니다.

## Query Key Rule

Include every parameter that changes the response.

```ts
const reservationListQueryKey = {
  all: ['reservations'],
  list: (params: ReservationListParams) => [...reservationListQueryKey.all, 'list', params],
};
```

## Error Rule

- Do not silently swallow API errors.
- Prefer server-provided messages when available.
- Keep user-facing fallback messages explicit.
- Decide whether the hook returns error state or lets the query library expose the error.
- Auth and validation errors should not retry by default.

## Verification

```bash
git diff --check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```
