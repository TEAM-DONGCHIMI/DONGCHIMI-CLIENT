# App Structure

동치미 클라이언트 웹 앱은 Next App Router를 라우팅/렌더링 경계로 사용하고, 제품 기능 코드는 `src/domains`에 둡니다.
사장님 사이트는 `apps/market-owner`의 Vite React 앱으로 시작하며, DCMSM-5부터 React Router와 domain 구조를 사용합니다.
이 문서는 generator, spec, Jira issue가 같은 구조를 가리키게 하는 source of truth입니다.

## Planned Apps

```text
apps/
  client/              동치미 클라이언트 웹
  market-owner/        마트 사장님 사이트 웹
  design-system-web/   디자인시스템 문서/미리보기 웹
  admin/               필요 시 추가
  mobile/              필요 시 React Native WebView shell로 추가
```

처음부터 모든 앱을 만들지 않습니다. 초기 제품 요구사항은 `apps/client`와 `apps/market-owner`를 중심으로 시작하고, admin, mobile, landing은 요구사항이 명확해진 뒤 추가합니다.

## Market Owner App

`apps/market-owner`는 사장님 사이트의 React 앱 workspace입니다.

- Jira key는 `DCMSM-*`를 사용합니다.
- package name은 `market-owner`입니다.
- 초기 scaffold는 Vite + React + TypeScript만 포함합니다.
- DCMSM-5부터 React Router 7을 사용해 root route와 fallback route를 제공합니다.
- 제품 domain route, API 연동, 디자인 토큰, 공통 component 승격은 별도 Jira 이슈에서 결정합니다.
- 앱 내부 구조가 확정되기 전까지 코드는 app-local에 두고, 실제 재사용이 확인된 뒤 `packages/*`로 승격합니다.

Market Owner의 초기 React Router 구조는 다음을 기준으로 합니다.

```text
src/
  app/          app shell, provider, router assembly, boundary, layout
  domains/      제품 domain과 route page composition
  shared/       앱 내부 공통 API, assets, components, config, constants, query, state, style, type, util 후보
```

- route path는 `src/shared/constants/routes.ts`에 상수로 둡니다.
- `src/app/router.tsx`는 route object와 `createBrowserRouter` 생성만 담당합니다.
- `@/*` alias는 `apps/market-owner/src/*`를 가리키며 app-local import에 사용합니다.
- `src/domains/{domain}`은 domain API, hooks, model, query key를 두는 기능 경계입니다.
- `src/domains/{domain}/{page}`는 route page composition을 두는 화면 경계입니다.
- `src/domains/{domain}/{page}`는 필요할 때 `components`, `sections`, `hooks`, `fixtures`, `utils`를 page-local 확장 지점으로 둡니다.
- `src/domains/{domain}/hooks`는 도메인 여러 page가 공유하는 query/mutation/use-case hook을 담당하고, `src/domains/{domain}/{page}/hooks`는 해당 page 안에서만 쓰는 UI 상태, URL state, form interaction hook을 담당합니다.
- 여러 page에서 재사용되는 UI는 `src/shared/components/{ui|layout}`로 올리고, 제품 전반 재사용이 확인되기 전에는 package로 승격하지 않습니다.
- 제품 IA가 확정되기 전에는 root route와 fallback route만 유지합니다.
- `gen:react-page`, `gen:app-component`, `gen:domain-component`, `gen:domain-section`은 `market-owner`를 지원합니다.
- `gen:domain-query`, `gen:domain-mutation`은 `market-owner`의 API/query baseline이 생긴 뒤 확장합니다.

사장님 앱의 desktop 운영툴 layout 착수 기준은 [Market Owner App](./market-owner-app.md)을 우선 확인합니다.

## Base Structure

`apps/client`의 `src/app`은 Next가 해석하는 route entry와 layout을 위한 공간입니다. 실제 화면 조립, API, query, model은 `src/domains`와 `src/shared`로 분리합니다.
모바일 웹 layout 착수 기준은 [Client App](./client-app.md)을 우선 확인합니다.

```text
src/
  app/
    layout.tsx
    providers.tsx
    globals.css
    (public)/
      page.tsx
    (auth)/
      login/page.tsx
    (main)/
      layout.tsx
      reservations/page.tsx
      reservations/loading.tsx
      reservations/error.tsx
      reservations/[reservationId]/page.tsx
    api/
      route-handler-only-when-needed/route.ts

  domains/
    reservation/
      api/
      hooks/
      model/
      query-keys.ts
      list/
        ReservationListPage.tsx
        ReservationListPage.spec.md
        components/
        sections/
        hooks/
        fixtures/
        utils/
      detail/
        ReservationDetailPage.tsx
        ReservationDetailPage.spec.md
        components/
        sections/
        hooks/
        fixtures/
        utils/

  shared/
    api/
    config/
    query/
    components/
      ui/
      layout/
    hooks/
    utils/
```

- `app`: Next route segment, route group, layout, loading, error, not-found, metadata, route handler만 둡니다.
- `domains`: 제품 기능 단위의 page composition, domain API, query/mutation hook, model을 둡니다.
- `shared`: 앱 내부 공통 인프라와 실제 여러 domain에서 재사용되는 코드만 둡니다.
- `packages/*`: 여러 app에서 실제 재사용이 확인된 뒤에만 승격합니다.

## App Router Structure

Route group은 URL을 바꾸지 않고 layout과 섹션을 나눌 때 사용합니다.

```text
app/
  (public)/      공개/랜딩성 화면
  (auth)/        로그인, 인증 진입
  (main)/        로그인 이후 주요 제품 화면
```

- route group 이름은 URL에 포함되지 않습니다.
- `page.tsx`와 `route.ts`가 있는 segment만 public route가 됩니다.
- `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`는 Next 파일 convention이므로 `app`에 둡니다.
- `providers.tsx`는 client provider를 모으는 얇은 Client Component로 유지하고, root `layout.tsx`는 Server Component로 유지합니다.
- route handler는 BFF, cookie/session bridge, token 은닉, 파일 업로드, API fan-out이 필요할 때만 `app/api`에 둡니다.

## Domain Page Structure

새 페이지는 도메인 단위 폴더 아래에 page 폴더를 둡니다.

```text
domains/{domain}/
  api/
  hooks/
  model/
  query-keys.ts
  {page}/
    {PageName}.tsx
    {PageName}.spec.md
    components/
    sections/
    hooks/
    fixtures/
    utils/
```

- `api/`, `hooks/`, `model/`, `query-keys.ts`는 같은 도메인 안의 여러 page가 공유하는 서버 통신 경계입니다.
- `model/`에는 domain type, API DTO 변환, schema처럼 page와 API가 같이 쓰는 도메인 계약을 둡니다.
- page 전용 UI 조각은 `{page}/components`, 화면 구획은 `{page}/sections`, page-local 상태와 상호작용 hook은 `{page}/hooks`, fixture는 `{page}/fixtures`, page 전용 순수 보조 함수는 `{page}/utils`에 둡니다.
- page 폴더 아래에 `api/`, `model/`, `query-keys.ts`를 만들지 않습니다.

## Server And Client Boundary

- 기본 page와 layout은 Server Component로 둡니다.
- `useState`, event handler, `useEffect`, browser API, TanStack Query hook이 필요한 파일만 Client Component로 둡니다.
- `'use client'`는 가능한 leaf component나 provider 경계에만 둡니다.
- Server Component에서 Client Component로 넘기는 props는 직렬화 가능한 값으로 제한합니다.
- browser에서 직접 호출하는 REST query/mutation은 `domains/{domain}/hooks`에서 TanStack Query로 처리합니다.
- public/static 성격의 서버 렌더링 데이터가 필요하면 Next `fetch`와 server cache 정책을 별도로 검토합니다.

## Dependency Direction

허용 방향:

```text
app -> domains -> shared -> packages
app -> shared -> packages
domains -> packages/design-system
shared -> packages
```

금지 방향:

```text
domains -> app
shared -> domains
packages/* -> apps/*
packages/design-system -> domains
```

## Placement Rules

- Next route가 필요한 새 page는 `pnpm gen:next-page`를 우선 사용합니다.
- route 없이 도메인 page만 필요한 경우 `pnpm gen:react-page`를 사용합니다.
- `market-owner`의 새 route page composition은 `pnpm gen:react-page --args market-owner <domain> <page> <PageName>`로 먼저 만들고, route object 연결은 제품 IA 확정 후 `src/app/router.tsx`에서 별도로 수행합니다.
- 페이지 내부에서만 쓰는 컴포넌트는 `apps/{app}/src/domains/{domain}/{page}/components`에 둡니다.
- 앱 안에서 여러 페이지가 공유하는 UI 또는 layout 컴포넌트는 `src/shared/components/{ui|layout}`로 이동합니다.
- 여러 앱이 공유하면 `packages/shared` 또는 `packages/design-system`으로 이동합니다.
- Next route entry, layout, metadata, route handler, provider 조립 코드는 `src/app`에 둡니다.
- route constant는 앱 내부 `shared/constants` 후보로 둡니다.
- 복잡한 상태, URL, form 로직은 page-local module로 분리하고, API/query/mutation 로직은 domain-level `hooks`로 분리합니다.

## Routing Rules

- 라우트 경로는 상수화합니다.
- URL params와 search params는 명시적으로 읽고 검증합니다.
- 첫 진입 화면은 정적 import를 우선합니다.
- 진입 이후 라우트와 fallback 라우트는 필요할 때 lazy load를 적용합니다.
