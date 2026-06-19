# Recipe: Add Page

Use this when adding or changing a route page.

## Steps

1. Jira issue 본문과 상태를 확인합니다.
2. route path, layout, access rule을 확인합니다.
3. app, domain, page folder, page component name을 결정합니다.
4. 새 Next route page면 generator가 준비된 뒤 scaffold를 생성합니다.

   ```bash
   pnpm gen:next-page --args client <route-path> <domain> <page> <PageName>
   ```

   라우터에 독립적인 React domain page만 필요하면 아래 generator를 사용합니다.

   ```bash
   pnpm gen:react-page --args client <domain> <page> <PageName>
   ```

5. `templates/page.spec.md` 또는 생성된 spec을 기준으로 가장 가까운 `page.spec.md`를 작성 또는 갱신합니다.
6. route params, search params, queries, mutations를 식별합니다.
7. page는 composition first로 구현합니다.
8. route-local components는 page directory 안에 둡니다.
9. page logic이 dense해질 때만 hook을 추출합니다.
10. loading, error, empty, disabled, success 상태를 처리합니다.
11. responsive behavior와 accessibility를 확인합니다.
12. 검증 명령과 남은 리스크를 요약합니다.

## DONGCHIMI Rules

- 앱별 Jira key를 확인합니다: `DCMCL-*`, `DCMDSW-*`, `DCMFE-*`.
- app-specific code는 실제 reuse 전까지 app 내부에 둡니다.
- Next route entry는 `apps/{app}/src/app/{route-path}/page.tsx`에 둡니다.
- 새 page 구조는 `apps/{app}/src/domains/{domain}/{page}/{PageName}.tsx`를 후보로 둡니다.
- Domain API helpers, query hooks, model, query keys는 `apps/{app}/src/domains/{domain}/{api|hooks|model|query-keys.ts}`에 둡니다.
- Page-local components와 sections는 `apps/{app}/src/domains/{domain}/{page}/{components|sections}`에 둡니다.
- Route group은 layout 경계가 필요할 때만 `app/(group)`으로 사용하고, URL path 설계와 domain 이름을 억지로 맞추지 않습니다.
- generator script details는 `docs/workflows/turbo-generators.md`를 따릅니다.

## Verification

```bash
git diff --check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

package script가 없으면 실행하지 못한 명령과 이유를 기록합니다.
