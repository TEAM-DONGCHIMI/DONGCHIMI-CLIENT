# Market Owner AsyncBoundary Spec

## Metadata

- Jira: DCMSM-17
- Route: 사장님 웹 React Router lazy route
- Owner: FE
- Status: Implemented

## Purpose

사장님 데스크탑 웹에서 lazy route pending 상태와 render error 상태를 같은 앱 전용 async boundary로 처리합니다.
`AsyncBoundary`는 React `Suspense`와 `react-error-boundary`를 조합하고, route page가 로딩 중이거나 예외를 던져도 복구 가능한 fallback을 제공합니다.

## Public API

- `children`: `AsyncBoundary` 아래에서 렌더링할 route 또는 UI입니다.
- `loadingFallback`: Suspense fallback을 교체할 때 사용합니다. 기본값은 `role="status"`를 가진 로딩 패널입니다.
- `errorFallback`: Error Boundary fallback render prop입니다. 기본값은 `role="alert"`와 `다시 시도` 버튼을 가진 에러 패널입니다.
- `resetKeys`: 값이 바뀌면 error boundary를 reset합니다.
- `onError`: route render error 로깅이 필요할 때 전달합니다.

## Usage

기본 라우트 페이지는 `src/app/router.tsx`의 `createLazyRoute` helper가 자동으로 `AsyncBoundary`를 적용합니다.
새 lazy route를 추가할 때는 기존 route와 동일하게 `createLazyRoute(() => import(...), 'ExportName')`를 사용합니다.

```tsx
{
  path: MARKET_OWNER_ROUTES.home,
  ...createLazyRoute(() => import('@/domains/home/overview/HomePage'), 'HomePage'),
}
```

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

TanStack Query 조회 에러를 fallback에서 재시도해야 하는 영역도 `AsyncBoundary`로 감쌉니다.
기본 query 정책은 조회 에러를 boundary로 전파하고, `다시 시도`는 `QueryErrorResetBoundary` reset과 함께 실행됩니다.
mutation-only 버튼이나 form submit 에러는 화면 fallback보다 toast 또는 inline error가 맞으므로 이 boundary로 우선 감싸지 않습니다.

`onError`는 Sentry 또는 logging 정책이 정해진 뒤 route/section 단위 로깅이 필요할 때 연결합니다.

## Scope

- `apps/market-owner/src/app/boundaries`에 앱 전용 `AsyncBoundary`를 둡니다.
- `apps/market-owner/src/app/router.tsx`의 lazy route component helper에서 `AsyncBoundary`를 적용합니다.
- `react-error-boundary` 의존성은 `apps/market-owner`에만 추가합니다.
- TanStack Query query error는 `AsyncBoundary` fallback UI로 전파하고, fallback reset은 `QueryErrorResetBoundary`와 함께 query retry를 허용합니다.

## Out Of Scope

- `apps/client`, `packages/shared`, `packages/design-system` 공통 Boundary로 승격하지 않습니다.
- TanStack Query error reset 정책과 Sentry 전송 정책은 이번 이슈에서 다루지 않습니다.
- 최종 에러 페이지 디자인은 별도 화면 작업이 생기면 교체합니다.

## States

- loading: route component import 또는 하위 UI가 suspend되면 기본 로딩 fallback을 렌더링합니다.
- error: 하위 route render 중 throw된 error는 기본 error fallback으로 전환합니다.
- query error: `queries.throwOnError` 기본값으로 `AsyncBoundary`까지 전파하고, mutation error는 사용자 상호작용 흐름을 끊지 않도록 `AsyncBoundary`로 전파하지 않습니다.
- disabled: 기본 retry 버튼은 별도 disabled 상태를 갖지 않습니다.
- keyboard / focus: retry 버튼은 native button이며 keyboard로 접근 가능합니다.

## Verification

- [ ] `corepack pnpm --filter market-owner lint`
- [ ] `corepack pnpm --filter market-owner typecheck`
- [ ] `corepack pnpm --filter market-owner test`
- [ ] `corepack pnpm --filter market-owner build`
