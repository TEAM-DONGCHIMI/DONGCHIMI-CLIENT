---
name: turbo-generator-workflow
description: 동치미 Turborepo generator script, template, scaffold 구조, sample generation 검증을 추가하거나 수정할 때 사용합니다.
---

# Turbo Generator Workflow

## 목적

루트 `package.json`의 `gen:*` script, `turbo/generators/config.ts`, `turbo/generators/templates/**`를 수정할 때 generator와 문서, skill, recipe가 같은 구조를 가리키도록 유지합니다.

동치미는 아직 실제 monorepo scaffold가 확정되지 않을 수 있으므로, generator가 없으면 구현하지 않고 `docs/workflows/turbo-generators.md`에 예정 구조와 후속 작업을 기록합니다.

## 적용 시점

- 새 `turbo gen` generator를 추가할 때
- 기존 generator arg, 출력 경로, template을 바꿀 때
- `gen:*` script를 추가하거나 수정할 때
- page/domain/API scaffold 구조를 문서화하거나 검증할 때

## 읽기 전략

항상 먼저 읽습니다.

- `docs/workflows/turbo-generators.md`

조건부로 읽습니다.

- 루트 `package.json`: 파일이 있을 때만 읽습니다.
- `turbo.json`, `turbo/generators/config.ts`: 파일이 있을 때만 읽습니다.

변경 범위에 따라 읽습니다.

- page 구조: `docs/architecture/app-structure.md`, `recipes/add-page.md`, `page-feature-workflow`
- component 구조: `recipes/add-component.md`, `app-shared-component-workflow`, `design-system-component-workflow`
- API/query 구조: `docs/architecture/data-layer.md`, `recipes/add-api-query.md`, `api-integration-workflow`
- agent 인덱싱: `docs/agent/index.md`, `docs/agent/indexing.md`

## 작업 흐름

1. Jira 또는 요청에서 generator 이름, arg 순서, 출력 경로, 제외 범위를 확인합니다.
2. 같은 목적의 기존 generator와 template이 있는지 먼저 확인합니다.
3. `package.json` 또는 `turbo/generators/config.ts`가 없으면 구현하지 않고 필요한 후속 작업을 문서화합니다.
4. generator 구현 파일이 있으면 root `package.json` script와 `turbo/generators/config.ts`를 같은 이름으로 연결합니다.
5. template은 endpoint, 제품 동작, 디자인 세부를 추측하지 않는 최소 scaffold로 작성합니다.
6. 기존 파일을 overwrite하지 않는 `add` action을 기본으로 사용합니다.
7. append가 필요한 파일은 중복 export를 건너뛰도록 구현합니다.
8. 관련 docs, recipes, skills, agent indexing을 같은 구조로 갱신합니다.
9. 샘플 생성 명령으로 app 경로 매핑을 확인합니다.
10. 샘플 산출물은 최종 diff에 남기지 않습니다.
11. generator typecheck와 repo 검증을 실행합니다.

## 도메인 Generator 기준

- 첫 번째 arg는 app 이름입니다. 기본 후보는 `client`, `design-system-web`, 선택적 `admin`입니다.
- app arg 누락 시 기본 앱으로 fallback하지 않습니다.
- domain 최상위에는 `api/`, `hooks/`, `query-keys.ts`만 둡니다.
- page 폴더 아래에는 `components/`, `sections/`, `utils/`만 둡니다.
- query/mutation scaffold는 API 계약 확인 전까지 TODO와 throwing helper를 유지합니다.
- app shared API/query generator는 만들지 않습니다.

## 검증

```bash
npx tsc -p turbo/generators/tsconfig.json
git diff --check
npm run format:check
npm run lint
npm run typecheck
npm run build
```

실제 script가 없으면 실행하지 못한 명령과 이유를 최종 요약에 남깁니다.
