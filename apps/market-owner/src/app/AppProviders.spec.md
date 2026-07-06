# Market Owner App Providers Spec

## Metadata

- Jira: DCMSM-16
- Route: 사장님 웹 app shell
- Owner: FE
- Status: Implemented

## Purpose

사장님 데스크탑 웹에서 overlay 기반 UI와 TanStack Query 기반 API 상태를 앱 전역에서 사용할 수 있게 provider wiring을 고정합니다.

## Scope

- `OverlayProvider`는 `apps/market-owner` app shell에만 적용합니다.
- `QueryProvider`는 기존 사장님 앱 query baseline을 유지합니다.
- provider 변경은 `apps/client`, `packages/shared`, `packages/design-system`으로 확장하지 않습니다.

## Provider Order

`AppProviders`는 `QueryProvider` 안에 `OverlayProvider`를 둡니다. OverlayKit은 provider의 children 뒤에 overlay 컴포넌트를 렌더하므로, Query provider가 바깥에 있어야 overlay content도 TanStack Query context를 사용할 수 있습니다.

Overlay content에서 React Router hook이 필요하면 route/layout 안쪽으로 provider 위치를 다시 검토하거나, routing 동작을 callback으로 주입합니다.

## Verification

- [ ] `corepack pnpm --filter market-owner lint`
- [ ] `corepack pnpm --filter market-owner typecheck`
- [ ] `corepack pnpm --filter market-owner test`
- [ ] `corepack pnpm --filter market-owner build`
