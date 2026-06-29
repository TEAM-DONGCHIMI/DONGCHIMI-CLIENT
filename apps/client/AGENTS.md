# Client App Agent Guide

이 경로에서는 root `AGENTS.md`를 먼저 따르고, `apps/client` 전용 규칙만 추가로 적용합니다.

## 저장소 정체

- Jira key: `DCMCL-*`
- Workspace: `apps/client`
- Package name: `client`
- App type: Next.js App Router

## 먼저 볼 문서

- [App Structure](../../docs/architecture/app-structure.md)
- [Data Layer](../../docs/architecture/data-layer.md)
- [Local Development](../../docs/workflows/local-development.md)
- [Add Page Recipe](../../recipes/add-page.md)
- [Page Feature Workflow](../../.agents/skills/page-feature-workflow/SKILL.md)
- [API Integration Workflow](../../.agents/skills/api-integration-workflow/SKILL.md)

## 로컬 원칙

- `src/app`에는 Next route entry, route group, layout, loading, error, not-found, metadata, route handler만 둡니다.
- 실제 화면 조립, page-local component, section, hook, fixture, util은 `src/domains/{domain}/{page}`에 둡니다.
- domain API helper, query/mutation hook, model, query key는 `src/domains/{domain}/{api|hooks|model|query-keys.ts}`에 둡니다.
- 여러 domain에서 실제로 재사용되는 앱 내부 코드만 `src/shared`로 올립니다.
- 여러 앱에서 재사용이 확인되기 전에는 `packages/shared` 또는 `packages/design-system`으로 승격하지 않습니다.
- Server Component를 기본값으로 두고, `useState`, event handler, browser API, TanStack Query hook이 필요한 leaf만 Client Component로 둡니다.
- `'use client'`는 가능한 leaf component나 provider 경계에만 둡니다.
- browser REST query/mutation은 domain hook에서 TanStack Query로 처리합니다.
- Next `fetch` 또는 route handler는 server cache, cookie/session bridge, token 은닉, API fan-out이 필요할 때만 사용합니다.

## Generator

```bash
pnpm gen:next-page --args client <route-path> <domain> <page> <PageName>
pnpm gen:react-page --args client <domain> <page> <PageName>
pnpm gen:domain-component --args client <domain> <page> <ComponentName> <component-folder>
pnpm gen:domain-section --args client <domain> <page> <SectionName> <section-folder>
pnpm gen:domain-query --args client <domain> <query-name>
pnpm gen:domain-mutation --args client <domain> <mutation-name>
```

기존 파일은 overwrite하지 않습니다. generator 지원 범위가 헷갈리면 root `package.json`과 `docs/workflows/turbo-generators.md`를 먼저 확인합니다.

## 검증

```bash
pnpm --filter client lint
pnpm --filter client typecheck
pnpm --filter client test
pnpm --filter client build
```

route 또는 사용자 흐름이 바뀌면 필요한 범위에서 `pnpm e2e:smoke`를 추가합니다.
