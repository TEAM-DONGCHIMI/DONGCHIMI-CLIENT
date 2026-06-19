# Recipe: Add API Query Or Mutation

Use this when adding a query hook, mutation hook, endpoint helper, or API type.

## Steps

1. API contract를 확인합니다.
   - endpoint
   - method
   - request params/body
   - response shape
   - error shape when available
2. `templates/hook.spec.md` 기준으로 가장 가까운 spec을 작성 또는 갱신합니다.
3. owning location을 결정합니다.
   - Domain API: `apps/{app}/src/pages/{domain}/api`
   - Domain query/mutation hook: `apps/{app}/src/pages/{domain}/hooks`
   - Domain query keys: `apps/{app}/src/pages/{domain}/query-keys.ts`
   - App shared API/query: real reuse가 생긴 뒤
   - Cross-app helper: real reuse가 생긴 뒤 `packages/shared`
4. 새 domain scaffold가 필요하면 matching generator를 사용합니다.

   ```bash
   pnpm gen:domain-query -- --args <client|design-system-web|admin> <domain> <QueryName>
   pnpm gen:domain-mutation -- --args <client|design-system-web|admin> <domain> <MutationName>
   ```

5. request/response type을 API boundary 가까이에 둡니다.
6. endpoint helper는 endpoint contract가 확인된 뒤 작성합니다.
7. query 또는 mutation hook에는 explicit query key를 둡니다.
8. response-changing params를 query key에 모두 포함합니다.
9. loading, error, empty, success 상태는 usage site에서 구분합니다.
10. cache invalidation, optimistic update, retry policy는 필요한 근거가 있을 때만 추가합니다.

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

## Verification

```bash
git diff --check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```
