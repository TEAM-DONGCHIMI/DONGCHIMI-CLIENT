# Turbo Generators

Turbo generator는 반복되는 scaffold를 같은 구조로 만들기 위한 보조 도구입니다.

현재 동치미 repo에는 generator 구현이 없을 수 있습니다. 실제 `package.json`, `turbo.json`, `turbo/generators/config.ts`가 생긴 뒤 이 문서를 실행 가능한 명령 기준으로 갱신합니다.

## Planned Scripts

| Script | Generator | Purpose |
| --- | --- | --- |
| `npm run gen:ds-component` | `turbo gen ds-component` | `packages/design-system` 공통 컴포넌트 |
| `npm run gen:app-component` | `turbo gen app-component` | 앱 내부 `src/shared/components/{ui|layout}` 컴포넌트 |
| `npm run gen:domain-page` | `turbo gen domain-page` | 앱 도메인 page scaffold |
| `npm run gen:domain-component` | `turbo gen domain-component` | 도메인 page-local component |
| `npm run gen:domain-section` | `turbo gen domain-section` | 도메인 page-local section |
| `npm run gen:domain-query` | `turbo gen domain-query` | 도메인 API query helper와 hook |
| `npm run gen:domain-mutation` | `turbo gen domain-mutation` | 도메인 API mutation helper와 hook |

## App Argument

앱 대상 generator는 첫 번째 arg로 앱을 받습니다.

```bash
npm run gen:domain-page -- --args <client|design-system-web|admin> <domain> <page> <PageName>
```

- `client`, `design-system-web`, `admin`을 기본 후보로 둡니다.
- `mobile`은 WebView native shell 특성이 있으므로 별도 generator 필요성을 먼저 검토합니다.
- app arg가 빠지면 기본 앱으로 fallback하지 않습니다.
- 앱별 Jira key는 `apps/client` = `DCMCL-*`, `apps/design-system-web` = `DCMDSW-*`, `packages/design-system` = `DCMDS-*`를 따릅니다.
- 여러 앱, `packages/*`, 루트 설정, 문서, generator 변경은 `DCMFE-*`를 우선 사용합니다.

## Domain Structure

새 도메인 page scaffold는 아래 구조를 기준으로 생성합니다.

```text
apps/{app}/src/pages/{domain}/
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

- `api/`, `hooks/`, `query-keys.ts`는 domain 최상위에 둡니다.
- `components/`, `sections/`, `utils/`는 page 폴더 아래에 둡니다.
- page 폴더 아래에 `api/`, `hooks/`, `query-keys.ts`를 만들지 않습니다.
- 기존 파일은 overwrite하지 않습니다.

## Query And Mutation Scaffold

`gen:domain-query`는 아래 파일을 생성하거나 갱신합니다.

```text
apps/{app}/src/pages/{domain}/api/{query-name}-api.ts
apps/{app}/src/pages/{domain}/hooks/use-{query-name}-query.ts
apps/{app}/src/pages/{domain}/hooks/use-{query-name}-query.spec.md
apps/{app}/src/pages/{domain}/query-keys.ts
```

`gen:domain-mutation`은 아래 파일을 생성합니다.

```text
apps/{app}/src/pages/{domain}/api/{mutation-name}-api.ts
apps/{app}/src/pages/{domain}/hooks/use-{mutation-name}-mutation.ts
apps/{app}/src/pages/{domain}/hooks/use-{mutation-name}-mutation.spec.md
```

- API endpoint, request, response, error shape는 generator가 추측하지 않습니다.
- 생성된 API helper는 계약 확인 전까지 `throw new Error(...)` 상태로 남깁니다.
- response를 바꾸는 모든 params는 query key에 포함합니다.
- app shared API/query generator는 만들지 않습니다.

## Generator Maintenance

generator를 추가하거나 바꿀 때 함께 갱신합니다.

- 루트 `package.json`의 `gen:*` script
- `turbo/generators/config.ts`
- `turbo/generators/templates/**`
- 관련 recipe와 skill
- `docs/workflows/turbo-generators.md`
- `docs/index.md`, `docs/agent/index.md`, `docs/agent/indexing.md`

## Verification

generator 변경 후 최소 검증:

```bash
npx tsc -p turbo/generators/tsconfig.json
git diff --check
```

샘플 생성 검증은 실제 diff에 남기지 않습니다. 생성된 샘플 파일은 경로와 내용을 확인한 뒤 제거합니다.
