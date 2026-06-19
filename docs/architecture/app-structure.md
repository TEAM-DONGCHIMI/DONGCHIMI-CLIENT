# App Structure

동치미 웹 앱 구조는 실제 `apps/*`가 생성된 뒤 확정합니다. 현재 문서는 generator, spec, Jira issue가 같은 예정 구조를 가리키게 하는 기준입니다.

## Planned Apps

```text
apps/
  client/              동치미 클라이언트 웹
  design-system-web/   디자인시스템 문서/미리보기 웹
  admin/               필요 시 추가
  mobile/              필요 시 React Native WebView shell로 추가
```

처음부터 모든 앱을 만들지 않습니다. 초기 제품 요구사항은 `apps/client`를 중심으로 시작하고, admin, mobile, landing은 요구사항이 명확해진 뒤 추가합니다.

## Base Structure

웹 앱이 생성되면 아래 구조를 기본으로 검토합니다.

```text
src/
  app/       앱 Provider, router 등 앱 실행 조립 코드
  pages/     라우트 또는 도메인 단위 화면 코드
  shared/    앱 내부 공통 코드
```

## Domain Page Structure

새 페이지는 도메인 단위 폴더 아래에 page 폴더를 둡니다.

```text
pages/{domain}/
  api/
  hooks/
  query-keys.ts
  {page}/
    {PageName}.tsx
    {PageName}.spec.md
    components/
    sections/
    utils/
```

- `api/`, `hooks/`, `query-keys.ts`는 같은 도메인 안의 여러 page가 공유하는 서버 통신 경계입니다.
- page 전용 UI 조각은 `{page}/components`, 화면 구획은 `{page}/sections`, page 전용 순수 보조 함수는 `{page}/utils`에 둡니다.
- page 폴더 아래에 `api/`, `hooks/`, `query-keys.ts`를 만들지 않습니다.

## Placement Rules

- 새 page scaffold는 `pnpm gen:domain-page`가 생긴 뒤 우선 사용합니다.
- 페이지 내부에서만 쓰는 컴포넌트는 `apps/{app}/src/pages/{domain}/{page}/components`에 둡니다.
- 앱 안에서 여러 페이지가 공유하는 UI 또는 layout 컴포넌트는 `src/shared/components/{ui|layout}`로 이동합니다.
- 여러 앱이 공유하면 `packages/shared` 또는 `packages/design-system`으로 이동합니다.
- 앱 실행 조립 코드는 `src/app`에 둡니다.
- route constant는 앱 내부 `shared/constants` 후보로 둡니다.
- 복잡한 상태, URL, form 로직은 page-local module로 분리하고, API/query/mutation 로직은 domain-level `hooks`로 분리합니다.

## Routing Rules

- 라우트 경로는 상수화합니다.
- URL params와 search params는 명시적으로 읽고 검증합니다.
- 첫 진입 화면은 정적 import를 우선합니다.
- 진입 이후 라우트와 fallback 라우트는 필요할 때 lazy load를 적용합니다.
