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
- route 설계
- 디자인 토큰 또는 vanilla-extract styling scaffold
- 공용 component 승격

## Local Commands

```bash
pnpm dev:market-owner
pnpm --filter market-owner lint
pnpm --filter market-owner typecheck
pnpm --filter market-owner build
```

루트 검증에서는 `pnpm lint`, `pnpm typecheck`, `pnpm build`가 `market-owner` workspace를 함께 실행합니다.

## Structure Rule

제품 route와 domain 구조는 요구사항이 확정된 뒤 별도 DCMSM Jira 이슈에서 추가합니다.
초기에는 app-local 코드를 우선하고, 실제 재사용이 확인되기 전에는 `packages/shared` 또는 `packages/design-system`으로 옮기지 않습니다.
