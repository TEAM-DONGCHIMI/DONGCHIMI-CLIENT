# Market Owner App Agent Guide

이 경로에서는 root `AGENTS.md`를 먼저 따르고, `apps/market-owner` 전용 규칙만 추가로 적용합니다.

## 저장소 정체

- Jira key: `DCMSM-*`
- Workspace: `apps/market-owner`
- Package name: `market-owner`
- App type: Vite React SPA
- Router: React Router 7

## 먼저 볼 문서

- [Market Owner App](../../docs/architecture/market-owner-app.md)
- [App Structure](../../docs/architecture/app-structure.md)
- [Data Layer](../../docs/architecture/data-layer.md)
- [Local Development](../../docs/workflows/local-development.md)
- [Add Page Recipe](../../recipes/add-page.md)
- [Page Feature Workflow](../../.agents/skills/page-feature-workflow/SKILL.md)
- [App Shared Component Workflow](../../.agents/skills/app-shared-component-workflow/SKILL.md)

## 로컬 원칙

- Next App Router 파일 convention을 만들지 않습니다. `page.tsx`, `layout.tsx`, route group은 `apps/client` 전용입니다.
- `src/app`은 app shell, provider wiring, router assembly, boundary, layout만 담당합니다.
- `src/app/router.tsx`는 route object와 `createBrowserRouter` 생성만 담당합니다.
- route path는 `src/shared/constants/routes.ts`에 상수로 둡니다.
- 실제 화면 조립, page-local component, section, hook, fixture, util은 `src/domains/{domain}/{page}`에 둡니다.
- domain API helper, query/mutation hook, model, query key는 `src/domains/{domain}/{api|hooks|model|query-keys.ts}`에 둡니다.
- 여러 page에서 실제로 재사용되는 앱 내부 코드만 `src/shared`로 올립니다.
- 여러 앱에서 재사용이 확인되기 전에는 `packages/shared` 또는 `packages/design-system`으로 승격하지 않습니다.
- `@/*` alias는 `apps/market-owner/src/*`를 가리키며 app-local import에만 사용합니다.

## Generator

```bash
pnpm gen:react-page --args market-owner <domain> <page> <PageName>
pnpm gen:domain-component --args market-owner <domain> <page> <ComponentName> <component-folder>
pnpm gen:domain-section --args market-owner <domain> <page> <SectionName> <section-folder>
pnpm gen:app-component --args market-owner <ComponentName> <ui|layout> <component-folder>
```

`gen:next-page`는 사용하지 않습니다. `gen:domain-query`, `gen:domain-mutation`은 market-owner API/query baseline이 확정된 뒤에만 추가합니다.

## 검증

```bash
pnpm --filter market-owner lint
pnpm --filter market-owner typecheck
pnpm --filter market-owner test
pnpm --filter market-owner build
```

라우팅, fallback, 배포 rewrite가 바뀌면 필요한 범위에서 `pnpm e2e:smoke`를 추가합니다.
