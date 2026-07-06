# Market Owner Boundary Spec

## Metadata

- Jira: DCMSM-17
- Route: 사장님 웹 React Router lazy route
- Owner: FE
- Status: Implemented

## Purpose

사장님 데스크탑 웹에서 lazy route pending 상태와 render error 상태를 같은 앱 전용 Boundary로 처리합니다.
Boundary는 React `Suspense`와 `react-error-boundary`를 조합하고, route page가 로딩 중이거나 예외를 던져도 복구 가능한 fallback을 제공합니다.

## Public API

- `children`: Boundary 아래에서 렌더링할 route 또는 UI입니다.
- `loadingFallback`: Suspense fallback을 교체할 때 사용합니다. 기본값은 `role="status"`를 가진 로딩 패널입니다.
- `errorFallback`: Error Boundary fallback render prop입니다. 기본값은 `role="alert"`와 `다시 시도` 버튼을 가진 에러 패널입니다.
- `resetKeys`: 값이 바뀌면 error boundary를 reset합니다.
- `onError`: route render error 로깅이 필요할 때 전달합니다.

## Scope

- `apps/market-owner/src/app/boundaries`에 앱 전용 Boundary를 둡니다.
- `apps/market-owner/src/app/router.tsx`의 lazy route component helper에서 Boundary를 적용합니다.
- `react-error-boundary` 의존성은 `apps/market-owner`에만 추가합니다.
- TanStack Query query error는 Boundary fallback UI로 전파하고, fallback reset은 `QueryErrorResetBoundary`와 함께 query retry를 허용합니다.

## Out Of Scope

- `apps/client`, `packages/shared`, `packages/design-system` 공통 Boundary로 승격하지 않습니다.
- TanStack Query error reset 정책과 Sentry 전송 정책은 이번 이슈에서 다루지 않습니다.
- 최종 에러 페이지 디자인은 별도 화면 작업이 생기면 교체합니다.

## States

- loading: route component import 또는 하위 UI가 suspend되면 기본 로딩 fallback을 렌더링합니다.
- error: 하위 route render 중 throw된 error는 기본 error fallback으로 전환합니다.
- query error: `queries.throwOnError` 기본값으로 Boundary까지 전파하고, mutation error는 사용자 상호작용 흐름을 끊지 않도록 Boundary로 전파하지 않습니다.
- disabled: 기본 retry 버튼은 별도 disabled 상태를 갖지 않습니다.
- keyboard / focus: retry 버튼은 native button이며 keyboard로 접근 가능합니다.

## Verification

- [ ] `corepack pnpm --filter market-owner lint`
- [ ] `corepack pnpm --filter market-owner typecheck`
- [ ] `corepack pnpm --filter market-owner test`
- [ ] `corepack pnpm --filter market-owner build`
