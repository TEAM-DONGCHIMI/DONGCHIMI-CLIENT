# Market Owner App

`apps/market-owner`는 마트 사장님 사이트를 위한 React workspace입니다.

## Identity

- Jira key: `DCMSM-*`
- Workspace path: `apps/market-owner`
- Package name: `market-owner`
- App type: Vite React SPA

## Initial Scope

초기 scaffold는 앱 실행, build, lint, typecheck가 가능한 최소 구조만 포함합니다.

포함 범위:

- Vite + React + TypeScript app shell
- repo 공통 ESLint, TypeScript config 연결
- Turborepo build/dev wiring
- DCMSM Jira, git, local development 문서 매핑

제외 범위:

- 실제 사장님 사이트 페이지 기능
- API 연동
- 디자인 토큰 또는 vanilla-extract styling scaffold
- 공용 component 승격

## Routing Scope

DCMSM-5부터 사장님 앱은 React Router 7을 SPA 라우팅 기준으로 사용합니다.
초기 라우팅 범위는 app bootstrap을 검증하는 root route와 fallback route로 제한합니다.

```text
src/
  app/
    App.tsx
    router.tsx
    router.spec.md
    boundaries/
    layouts/
    providers/
    routes/
  domains/
    home/
      overview/
        HomePage.tsx
        components/
        sections/
        hooks/
        fixtures/
        utils/
    not-found/
      fallback/
        NotFoundPage.tsx
        components/
        sections/
        hooks/
        fixtures/
        utils/
    {domain}/
      api/
      hooks/
      model/
      query-keys.ts
      {page}/
        {PageName}.tsx
        {PageName}.spec.md
        components/
        sections/
        fixtures/
        utils/
  shared/
    api/
    assets/
      icons/
      images/
    components/
      layout/
      ui/
    config/
    constants/
      routes.ts
    hooks/
    query/
    stores/
    styles/
    types/
    utils/
```

- `src/app`은 router assembly와 provider wiring처럼 앱 실행 경계를 담당합니다.
- `src/domains/{domain}`은 제품 기능 단위의 API, query hook, model, query key를 담당합니다.
- `src/domains/{domain}/{page}`는 route에 연결되는 app-local page component와 page-local 모듈을 담당합니다.
- `src/domains/{domain}/{page}/components`는 page 내부 UI 조각, `sections`는 화면 구획, `hooks`는 page-local 상태/상호작용 hook, `fixtures`는 page-local fixture, `utils`는 page-local 순수 보조 함수를 담당합니다.
- `src/shared/constants/routes.ts`는 route path 상수를 담당합니다.
- `src/shared`는 여러 page에서 실제로 재사용되는 앱 내부 공통 API, assets, components, query, state, style, type, util 후보만 담당합니다.
- 제품 domain, nested route, protected route는 요구사항 확정 후 별도 DCMSM Jira에서 추가합니다.

## Local Commands

```bash
pnpm dev:market-owner
pnpm --filter market-owner lint
pnpm --filter market-owner typecheck
pnpm --filter market-owner build
```

루트 검증에서는 `pnpm lint`, `pnpm typecheck`, `pnpm build`가 `market-owner` workspace를 함께 실행합니다.

## Structure Rule

제품 domain 구조는 요구사항이 확정된 뒤 별도 DCMSM Jira 이슈에서 추가합니다.
초기에는 app-local 코드를 우선하고, 실제 재사용이 확인되기 전에는 `packages/shared` 또는 `packages/design-system`으로 옮기지 않습니다.
