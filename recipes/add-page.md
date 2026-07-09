# Recipe: Add Page

Use this when adding or changing a route page.

Quality rule:

- `docs/code-quality/frontend-fundamentals.md`
- `docs/code-quality/frontend-readability.md`, `docs/code-quality/frontend-predictability.md`, `docs/code-quality/frontend-cohesion.md`, `docs/code-quality/frontend-coupling.md`
- `docs/code-quality/frontend-logic-composition.md`

## Steps

1. Jira issue 본문과 상태를 확인합니다.
2. Figma URL, frame name 또는 Screen ID, target viewport를 확인합니다.
3. route path, layout shell, navigation, access rule을 확인합니다.
4. `packages/design-system`의 `ui`, `layout`, icon component를 먼저 탐색합니다.
5. app-shared로 둘 후보와 page-local에 남길 후보를 구분하고, design-system으로 승격하지 않는 이유를 spec에 남깁니다.
6. app, domain, page folder, page component name을 결정합니다.
7. 새 Next route page면 generator가 준비된 뒤 scaffold를 생성합니다.

   ```bash
   pnpm gen:next-page --args client <route-path> <domain> <page> <PageName>
   ```

   라우터에 독립적인 React domain page만 필요하면 아래 generator를 사용합니다.

   ```bash
   pnpm gen:react-page --args client <domain> <page> <PageName>
   pnpm gen:react-page --args market-owner <domain> <page> <PageName>
   ```

8. `templates/page.spec.md` 또는 생성된 spec을 기준으로 가장 가까운 `page.spec.md`를 작성 또는 갱신합니다.
9. route params, search params, queries, mutations를 식별합니다.
10. page는 composition first로 구현합니다.
11. route-local components는 page directory 안에 둡니다.
12. page logic이 dense해질 때만 hook을 추출합니다.
13. loading, error, empty, disabled, success 상태를 처리합니다.
14. responsive behavior와 accessibility를 확인합니다.
15. browser에서 route와 viewport를 확인하고 screenshot, preview URL, Figma mismatch를 PR evidence에 남깁니다.
16. Frontend Fundamentals 허브, 개별 기준 문서, logic composition 기준으로 page composition, hook 추출, 조건 분기, 응집도/결합도를 self-check합니다.
17. 검증 명령과 남은 리스크를 요약합니다.

## Publishing Checklist

- Figma frame과 구현 route가 같은 화면을 가리키는지 확인합니다.
- 사용 가능한 design-system `ui`, `layout`, icon component를 확인하고 사용 여부를 spec에 적습니다.
- 새 컴포넌트가 한 page 전용이면 page-local에 두고, 여러 page에서 실제로 공유될 때만 app-shared로 올립니다.
- 제품 copy, route, API, analytics, 권한에 결합된 UI는 design-system으로 승격하지 않습니다.
- 디자인과 다른 구현은 누락이 아니라 의도 또는 제약인지 PR에 기록합니다.
- browser route, viewport, 주요 상태, focus-visible을 확인한 근거를 남깁니다.

## DONGCHIMI Rules

- 앱별 Jira key를 확인합니다: `DCMCL-*`, `DCMDS-*`, `DCMFE-*`.
- `apps/design-system-web` 페이지는 디자인시스템 package와 같은 `DCMDS-*`에서 관리합니다.
- 사장님 사이트 작업은 `apps/market-owner` 범위이면 `DCMSM-*`, root/generator/docs 범위이면 `DCMFE-*`를 사용합니다.
- app-specific code는 실제 reuse 전까지 app 내부에 둡니다.
- Next route entry는 `apps/{app}/src/app/{route-path}/page.tsx`에 둡니다.
- `market-owner`는 Vite React SPA이므로 Next route entry를 만들지 않습니다. page composition은 `gen:react-page --args market-owner ...`로 만들고, route object 연결은 제품 IA가 확정된 뒤 `apps/market-owner/src/app/router.tsx`에서 별도로 수행합니다.
- 새 page 구조는 `apps/{app}/src/domains/{domain}/{page}/{PageName}.tsx`를 후보로 둡니다.
- Domain API helpers, query hooks, model, query keys는 `apps/{app}/src/domains/{domain}/{api|hooks|model|query-keys.ts}`에 둡니다.
- Page-local components, sections, hooks, fixtures, utils는 `apps/{app}/src/domains/{domain}/{page}/{components|sections|hooks|fixtures|utils}`에 둡니다.
- Route group은 layout 경계가 필요할 때만 `app/(group)`으로 사용하고, URL path 설계와 domain 이름을 억지로 맞추지 않습니다.
- `apps/client` page layout은 모바일 웹 기준으로 `docs/architecture/client-app.md`를 확인합니다.
- `apps/market-owner` page layout은 데스크탑 운영툴 기준으로 `docs/architecture/market-owner-app.md`를 확인합니다.
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
