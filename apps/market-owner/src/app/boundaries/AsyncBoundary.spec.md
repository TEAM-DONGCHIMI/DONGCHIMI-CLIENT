# Market Owner AsyncBoundary Spec

## Metadata

- Jira: DCMSM-17
- Component: `AsyncBoundary`
- Route: 사장님 웹 React Router lazy route
- Owner: FE
- Status: Implemented

## Purpose

사장님 데스크탑 웹에서 lazy route pending 상태와 render/query error 상태를 같은 앱 전용 async boundary로 처리합니다.
`AsyncBoundary`는 React `Suspense`, `react-error-boundary`, TanStack Query `QueryErrorResetBoundary`를 조합하고, route page나 page section이 로딩 중이거나 예외를 던져도 복구 가능한 fallback을 제공합니다.

## Source Of Truth

- Jira: DCMSM-17
- Related spec: `apps/market-owner/src/app/router.spec.md`
- Route helper: `apps/market-owner/src/app/create-lazy-route.tsx`
- Query policy: `apps/market-owner/src/shared/query/query-client.ts`
- Component template: `templates/component.spec.md`

## Scope

- `apps/market-owner/src/app/boundaries`에 앱 전용 `AsyncBoundary`를 둡니다.
- `apps/market-owner/src/app/create-lazy-route.tsx`에서 lazy route component를 `AsyncBoundary`로 감쌉니다.
- `apps/market-owner/src/app/router.tsx`는 route object와 `createBrowserRouter` 생성만 담당하고, lazy route wrapping은 helper에 위임합니다.
- `react-error-boundary` 의존성은 `apps/market-owner`에만 추가합니다.
- TanStack Query query error는 `AsyncBoundary` fallback UI로 전파하고, fallback reset은 `QueryErrorResetBoundary`와 함께 query retry를 허용합니다.

## Out Of Scope

- `apps/client`, `packages/shared`, `packages/design-system` 공통 Boundary로 승격하지 않습니다.
- mutation-only 버튼 또는 form submit 에러를 `AsyncBoundary` fallback으로 전환하지 않습니다.
- Sentry 전송 정책, toast 정책, 인증 에러 redirect 정책은 이번 이슈에서 다루지 않습니다.
- 최종 에러 페이지 디자인은 별도 화면 작업이 생기면 교체합니다.

## UI Structure

```text
AsyncBoundary
  QueryErrorResetBoundary
    ErrorBoundary
      Suspense
        children

DefaultLoadingFallback
  fallback root(role=status, aria-live=polite)
    fallback panel
      title
      description

DefaultErrorFallback
  fallback root(role=alert)
    fallback panel
      title
      description
      retry button
```

## Public API

- component: `AsyncBoundary`
- props:
  - `children`: `AsyncBoundary` 아래에서 렌더링할 route 또는 UI입니다.
  - `loadingFallback`: Suspense fallback을 교체할 때 사용합니다. 기본값은 `role="status"`를 가진 로딩 패널입니다.
  - `errorFallback`: Error Boundary fallback render prop입니다. 기본값은 `role="alert"`와 `다시 시도` 버튼을 가진 에러 패널입니다.
  - `resetKeys`: 값이 바뀌면 error boundary를 reset합니다. route param, tab id, filter id처럼 화면/데이터 기준이 바뀌는 값에 사용합니다.
  - `onError`: route 또는 section render error 로깅이 필요할 때 전달합니다.
- exported types: `AsyncBoundaryProps`
- caller responsibility: section 크기에 맞는 fallback이 필요하면 `loadingFallback` 또는 `errorFallback`을 전달합니다.
- non-owned behavior: query retry 가능 여부는 TanStack Query query option과 query function 동작을 따릅니다.

### Route usage

기본 라우트 페이지는 `src/app/create-lazy-route.tsx`의 `createLazyRoute` helper가 자동으로 `AsyncBoundary`를 적용합니다.
새 lazy route를 추가할 때는 기존 route와 동일하게 `createLazyRoute(() => import(...), 'ExportName')`를 사용합니다.

```tsx
{
  path: MARKET_OWNER_ROUTES.home,
  ...createLazyRoute(() => import('@/domains/home/overview/HomePage'), 'HomePage'),
}
```

### Section usage

페이지 로컬에서 특정 section만 별도로 loading/error 경계로 제한해야 할 때는 아래처럼 사용합니다.
이 방식은 페이지 전체를 fallback으로 바꾸기보다 table, preview, chart처럼 독립적으로 복구할 수 있는 영역에 사용합니다.

```tsx
import { AsyncBoundary } from '@/app/boundaries';

export const ProductSection = () => {
  return (
    <AsyncBoundary>
      <ProductTable />
    </AsyncBoundary>
  );
};
```

### Custom fallback usage

section 크기에 맞는 fallback이 필요하면 `loadingFallback` 또는 `errorFallback`을 주입합니다.

```tsx
import { type FallbackProps } from 'react-error-boundary';

import { AsyncBoundary } from '@/app/boundaries';

const ProductTableErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <TableErrorState description='상품 목록을 불러오지 못했습니다.' onRetry={resetErrorBoundary} />
  );
};

export const ProductTableSection = () => {
  return (
    <AsyncBoundary
      errorFallback={ProductTableErrorFallback}
      loadingFallback={<TableSkeleton rowCount={8} />}
    >
      <ProductTable />
    </AsyncBoundary>
  );
};
```

### Reset keys usage

route param, tab id, filter id처럼 복구 기준이 되는 값이 바뀌면 `resetKeys`를 전달합니다.
이 값이 바뀌면 이전 error fallback 상태를 유지하지 않고 새로운 화면 상태로 다시 렌더링합니다.

```tsx
import { AsyncBoundary } from '@/app/boundaries';

type ProductDetailSectionProps = Readonly<{
  productId: string;
}>;

export const ProductDetailSection = ({ productId }: ProductDetailSectionProps) => {
  return (
    <AsyncBoundary resetKeys={[productId]}>
      <ProductDetail productId={productId} />
    </AsyncBoundary>
  );
};
```

## Variants

- default route fallback: route lazy loading과 route render error를 처리합니다.
- section fallback: table, preview, chart처럼 독립 복구가 가능한 UI 영역에 적용합니다.
- custom fallback: caller가 `loadingFallback` 또는 `errorFallback`을 주입해 section 크기에 맞는 UI를 제공합니다.

## States

- loading: route component import 또는 하위 UI가 suspend되면 기본 로딩 fallback을 렌더링합니다.
- error: 하위 route/section render 중 throw된 error는 기본 error fallback으로 전환합니다.
- query error: `queries.throwOnError` 기본값으로 `AsyncBoundary`까지 전파하고, mutation error는 사용자 상호작용 흐름을 끊지 않도록 `AsyncBoundary`로 전파하지 않습니다.
- reset: 기본 retry 버튼 또는 custom fallback의 `resetErrorBoundary`가 ErrorBoundary와 TanStack Query error reset을 함께 실행합니다.
- disabled: 기본 retry 버튼은 별도 disabled 상태를 갖지 않습니다.
- selected / active: 이번 컴포넌트에서 다루지 않습니다.
- invalid: 이번 컴포넌트에서 다루지 않습니다.

## Accessibility

- keyboard: retry 버튼은 native `button`이며 keyboard로 접근 가능합니다.
- focus: retry 버튼은 focus-visible outline을 제공합니다.
- aria / semantic: loading fallback은 `role="status"`와 `aria-live="polite"`를 사용하고, error fallback은 `role="alert"`를 사용합니다.

## Styling Constraints

- size: 기본 fallback root는 section-level 사용을 깨뜨리지 않도록 viewport 고정 높이가 아니라 parent-relative `min-height: 100%`를 사용합니다.
- spacing: fallback root는 `4rem`, fallback panel은 `3.2rem` padding과 `1.6rem` gap을 사용합니다.
- color/token: design-system token(`atomic`, `shadow`, `typography`)만 사용합니다.
- responsive: panel width는 `min(100%, 42rem)`로 제한합니다.
- overflow: route와 section 내부에서 모두 쓸 수 있도록 fallback root가 부모 영역 밖으로 불필요하게 확장되지 않아야 합니다.

## Verification

- [ ] `corepack pnpm --filter market-owner lint`
- [ ] `corepack pnpm --filter market-owner typecheck`
- [ ] `corepack pnpm --filter market-owner test`
- [ ] `corepack pnpm --filter market-owner build`

## Open Questions

- 실제 API/form 정책이 확정되면 mutation error toast, 인증 에러 redirect, query error code별 fallback copy를 별도 이슈로 분리합니다.
- 다른 앱에서도 같은 query/reset/fallback 정책이 반복되면 UI/copy 없는 base boundary만 shared 후보로 검토합니다.
