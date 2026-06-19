# Turbo Generators

Turbo generator는 반복되는 scaffold를 같은 구조로 만들기 위한 보조 도구입니다.

동치미 repo는 `@turbo/gen` 기반 generator를 사용합니다. 실행 가능한 명령은 root `package.json`의 `gen:*` script를 기준으로 합니다.

## Scripts

| Script                      | Generator                    | Purpose                                               |
| --------------------------- | ---------------------------- | ----------------------------------------------------- |
| `pnpm gen:ds-component`     | `turbo gen ds-component`     | `packages/design-system` 공통 컴포넌트                |
| `pnpm gen:app-component`    | `turbo gen app-component`    | 앱 내부 `src/shared/components/{ui\|layout}` 컴포넌트 |
| `pnpm gen:next-page`        | `turbo gen next-page`        | Next App Router route와 도메인 page scaffold          |
| `pnpm gen:react-page`       | `turbo gen react-page`       | 라우터에 독립적인 React 도메인 page scaffold          |
| `pnpm gen:domain-component` | `turbo gen domain-component` | 도메인 page-local component                           |
| `pnpm gen:domain-section`   | `turbo gen domain-section`   | 도메인 page-local section                             |
| `pnpm gen:domain-query`     | `turbo gen domain-query`     | 도메인 API query helper와 hook                        |
| `pnpm gen:domain-mutation`  | `turbo gen domain-mutation`  | 도메인 API mutation helper와 hook                     |

## App Argument

앱 대상 generator는 첫 번째 arg로 앱을 받습니다.

```bash
pnpm gen:next-page --args client <route-path> <domain> <page> <PageName>
pnpm gen:react-page --args client <domain> <page> <PageName>
```

- 현재 generator가 허용하는 app은 실제 존재하는 `client`뿐입니다.
- `design-system-web`, `admin`, `mobile`은 실제 앱이 생성된 뒤 generator choice에 추가합니다.
- `mobile`은 WebView native shell 특성이 있으므로 별도 generator 필요성을 먼저 검토합니다.
- app arg가 빠지면 기본 앱으로 fallback하지 않습니다.
- 앱별 Jira key는 `apps/client` = `DCMCL-*`, `apps/design-system-web` = `DCMDSW-*`, `packages/design-system` = `DCMDS-*`를 따릅니다.
- 여러 앱, `packages/*`, 루트 설정, 문서, generator 변경은 `DCMFE-*`를 우선 사용합니다.

## Page And Domain Structure

Next route entry는 `src/app`에 두고, 라우터에 독립적인 page composition과 API/query 경계는 `src/domains`에 둡니다.

```text
apps/{app}/src/app/{route-path}/
  page.tsx
  page.spec.md
```

새 도메인 page scaffold는 아래 구조를 기준으로 생성합니다.

```text
apps/{app}/src/domains/{domain}/
  api/
  hooks/
  model/
  query-keys.ts
  {page}/
    {PageName}.tsx
    {PageName}.spec.md
    components/
    sections/
    utils/
```

- `api/`, `hooks/`, `model/`, `query-keys.ts`는 domain 최상위에 둡니다.
- `model/`은 domain type, schema, DTO 변환 같은 도메인 계약을 둡니다.
- `components/`, `sections/`, `utils/`는 page 폴더 아래에 둡니다.
- page 폴더 아래에 `api/`, `hooks/`, `model/`, `query-keys.ts`를 만들지 않습니다.
- Next route entry는 `src/domains/{domain}/{page}/{PageName}`를 import하고, 라우트 파싱과 layout 같은 Next concern만 담당합니다.
- 기존 파일은 overwrite하지 않습니다.

## Query And Mutation Scaffold

`gen:domain-query`는 아래 파일을 생성하거나 갱신합니다.

```text
apps/{app}/src/domains/{domain}/api/{query-name}-api.ts
apps/{app}/src/domains/{domain}/hooks/use-{query-name}-query.ts
apps/{app}/src/domains/{domain}/hooks/use-{query-name}-query.spec.md
apps/{app}/src/domains/{domain}/model/
apps/{app}/src/domains/{domain}/query-keys.ts
```

`gen:domain-mutation`은 아래 파일을 생성합니다.

```text
apps/{app}/src/domains/{domain}/api/{mutation-name}-api.ts
apps/{app}/src/domains/{domain}/hooks/use-{mutation-name}-mutation.ts
apps/{app}/src/domains/{domain}/hooks/use-{mutation-name}-mutation.spec.md
apps/{app}/src/domains/{domain}/model/
```

- API endpoint, request, response, error shape는 generator가 추측하지 않습니다.
- 생성된 API helper는 `TODO_ENDPOINT` placeholder를 남기며, 계약 확인 전까지 실제 endpoint로 간주하지 않습니다.
- response를 바꾸는 모든 params는 query key에 포함합니다.
- app shared API/query generator는 만들지 않습니다.

## Design System Component Scaffold

`gen:ds-component`는 아래 파일을 생성하고 explicit export를 갱신합니다.

```text
packages/design-system/src/components/{ui|layout}/{component-folder}/
  ComponentName.tsx
  ComponentName.spec.md
  ComponentName.stories.tsx
  index.ts
```

```bash
pnpm gen:ds-component --args Button ui button
```

- `componentName`은 PascalCase를 사용합니다.
- `category`는 `ui` 또는 `layout`만 허용합니다.
- `componentFolder`는 kebab-case를 사용합니다.
- `packages/design-system/src/index.ts`, `components/index.ts`, category index는 중복 export를 건너뛰며 append합니다.

## Unsupported Cases

- form 전용 generator는 아직 만들지 않습니다. form 작업은 `recipes/add-form.md`와 `form-flow-workflow` 기준으로 수동 scaffold를 작성합니다.
- icon generator는 Figma/SVG source와 보안 검증 기준이 확정된 뒤 별도 작업에서 추가합니다.
- 새 app 대상 generator는 해당 app package와 routing 구조가 실제로 생긴 뒤 추가합니다.

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
pnpm check:generators
git diff --check
```

샘플 생성 검증은 실제 diff에 남기지 않습니다. 생성된 샘플 파일은 경로와 내용을 확인한 뒤 제거합니다.
