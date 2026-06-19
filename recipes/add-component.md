# Recipe: Add Component

Use this when adding a route-local, app-shared, or design-system component.

## Steps

1. 기존 route-local, app-shared, design-system 후보를 먼저 확인합니다.
2. 컴포넌트 위치를 결정합니다: route-local, app-shared, package-shared.
3. 새 scaffold를 추가할 때는 matching generator를 사용합니다.

   ```bash
   pnpm gen:domain-component -- --args <client|design-system-web|admin> <domain> <page> <ComponentName> <component-folder>
   pnpm gen:domain-section -- --args <client|design-system-web|admin> <domain> <page> <SectionName> <section-folder>
   pnpm gen:app-component -- --args <client|design-system-web|admin> <ComponentName> <ui|layout> <component-folder>
   ```

4. `templates/component.spec.md` 기준으로 spec을 작성 또는 갱신합니다.
5. public API, props, behavior, states, accessibility, styling constraints를 정의합니다.
6. 최소 컴포넌트 API를 구현합니다.
7. 현재 styling/token convention을 사용합니다.
8. text overflow, focus-visible, disabled, hover, responsive behavior를 확인합니다.
9. 프로젝트 convention이 요구하는 범위까지만 export합니다.

## Placement

- Page-only component: `apps/{app}/src/pages/{domain}/{page}/components`
- Page-only section: `apps/{app}/src/pages/{domain}/{page}/sections`
- App-shared component: `apps/{app}/src/shared/components/{ui|layout}`
- Cross-app UI component: `packages/design-system`

## Verification

```bash
git diff --check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```
