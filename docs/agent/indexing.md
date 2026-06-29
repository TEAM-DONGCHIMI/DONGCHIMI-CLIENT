# Agent Indexing

이 문서는 DONGCHIMI-CLIENT의 agent 문서가 Codex에 어떻게 노출되는지 정의합니다.

## Automatically Loaded

Codex는 작업 시작 시 `AGENTS.md` 계층을 읽습니다.

- 전역: `~/.codex/AGENTS.override.md` 또는 `~/.codex/AGENTS.md`
- 프로젝트: repo root부터 현재 작업 디렉터리까지 각 경로의 `AGENTS.override.md` 또는 `AGENTS.md`
- 하위 디렉터리 문서가 나중에 합쳐지므로 더 가까운 지침이 우선합니다.

DONGCHIMI-CLIENT의 현재 자동 로드 지침:

```text
AGENTS.md
apps/client/AGENTS.md
apps/market-owner/AGENTS.md
packages/design-system/AGENTS.md
```

`AGENTS.md`는 상세 설명서가 아니라 agent entrypoint입니다. 문서 탐색 순서, source of truth, 필수 검증만 남기고 상세 구현 규칙은 `docs/`, `recipes/`, `templates/`, `.agents/skills/`로 연결합니다.
하위 `AGENTS.md`는 해당 workspace 아래에서만 적용되는 로컬 불변량과 검증 명령만 둡니다.

## Source Layers

| Path                            | Indexed as                  | Rule                                             |
| ------------------------------- | --------------------------- | ------------------------------------------------ |
| `AGENTS.md`                     | 자동 instruction entrypoint | 짧은 라우팅과 필수 원칙만 둡니다.                |
| `apps/*/AGENTS.md`              | workspace-local instruction | 앱별 route, domain, 검증 불변량만 둡니다.        |
| `packages/*/AGENTS.md`          | package-local instruction   | package public boundary와 검증 불변량만 둡니다.  |
| `README.md`                     | 사람용 repo entrypoint      | 프로젝트 소개, 빠른 시작, 주요 링크만 둡니다.    |
| `docs/index.md`                 | 문서 링크 허브              | architecture, workflow, agent 문서를 연결합니다. |
| `docs/agent/*`                  | agent harness 정책          | Codex 인덱싱, config, hook 책임을 설명합니다.    |
| `.agents/skills/*`              | repo-local skill            | 선택된 작업 유형의 실행 절차를 담습니다.         |
| `recipes/*`                     | 반복 작업 절차              | 사람이 따라 할 수 있는 절차를 둡니다.            |
| `templates/*`                   | spec/Jira 작성 형식         | 구현 전 산출물의 형식을 둡니다.                  |
| `.github/*`                     | PR/CI 자동화                | GitHub 표면의 실행 기준을 둡니다.                |
| `.node-version`, `package.json` | runtime/package source      | Node와 pnpm 기준은 문서가 아니라 파일을 봅니다.  |

## Repo Skills

Repo-scoped Codex skill은 `.agents/skills` 아래에 둡니다.

```text
.agents/skills/
  api-integration-workflow/SKILL.md
  app-shared-component-workflow/SKILL.md
  jira-design-implementation-workflow/SKILL.md
  frontend-task-orchestrator/SKILL.md
  frontend-quality-verification/SKILL.md
  frontend-fundamentals-review/SKILL.md
  commit-planning-workflow/SKILL.md
  turbo-generator-workflow/SKILL.md
  design-system-component-workflow/SKILL.md
  page-feature-workflow/SKILL.md
  form-flow-workflow/SKILL.md
  performance-diagnosis/SKILL.md
  refactor-evaluator/SKILL.md
  sequential-thinking/SKILL.md
  architecture-review/SKILL.md
  browser-pr-review-workflow/SKILL.md
  manage-skills/SKILL.md
  project-monitoring-workflow/SKILL.md
  verify-implementation/SKILL.md
  verify-agent-docs/SKILL.md
  verify-design-system-icons/SKILL.md
  verify-design-system-styles/SKILL.md
  verify-github-workflows/SKILL.md
  verify-deployment/SKILL.md
  verify-route-boundaries/SKILL.md
  verify-e2e-smoke/SKILL.md
  verify-performance-budget/SKILL.md
```

각 skill은 `SKILL.md` frontmatter에 `name`과 `description`을 가져야 합니다.
Codex는 처음에는 skill의 이름, 설명, 경로만 컨텍스트에 넣고, 실제로 skill을 선택할 때 전체 `SKILL.md`를 읽습니다.

## Verify Skill Growth

검증 skill처럼 수가 늘어날 수 있는 skill도 `.agents/skills`에 직접 둡니다.

```text
.agents/skills/
  manage-skills/SKILL.md
  verify-implementation/SKILL.md
  verify-agent-docs/SKILL.md
  verify-design-system-icons/SKILL.md
  verify-design-system-styles/SKILL.md
  verify-github-workflows/SKILL.md
  verify-deployment/SKILL.md
  verify-route-boundaries/SKILL.md
  verify-e2e-smoke/SKILL.md
  verify-performance-budget/SKILL.md
```

폴더가 많아지는 경우에도 nested grouping 대신 skill 이름 prefix로 정렬합니다.

## Referenced Documents

다음 문서는 자동 instruction chain이 아니라 `AGENTS.md` 또는 skill이 필요할 때 참조하는 자료입니다.

- `docs/`: 아키텍처, 코드 품질, 컨벤션, workflow 기준
- `recipes/`: 반복 작업 절차
- `templates/`: 구현 전 spec 작성 형식
- `.github/`: PR template과 GitHub workflow가 생기면 관련 기준

Sentry 설정과 알림 운영 기준은 `docs/workflows/sentry.md`를 참조합니다.

이 파일들은 실행 지침이 아니라 근거 문서입니다. 모든 내용을 `AGENTS.md`에 복사하지 않고 링크로 유지합니다.

## Path Rules

- repo skill 경로는 `.agents/skills/*/SKILL.md`를 기준으로 안내합니다.
- `skills/` 루트 디렉터리는 사용하지 않습니다.
- repo skill 저장 위치는 `.agents/skills` 하나로 고정합니다.
- `.agents/skills` 아래에 skill을 중첩 그룹으로 만들지 않습니다.
- 새 agent 문서는 `docs/agent/` 아래에 추가합니다.
- 새 하위 workspace에 다른 규칙이 필요할 때만 해당 디렉터리에 `AGENTS.md`를 추가합니다.
- 하위 `AGENTS.md`에는 root 문서의 긴 규칙을 복사하지 않고, workspace-local 추가 규칙만 둡니다.
- runtime 버전은 Codex skill이나 config에 고정하지 않고 `.node-version`과 root `package.json`을 참조합니다.

## Verification

문서 인덱싱을 바꾼 뒤 확인할 것:

```bash
find . -path '*/AGENTS.md' -not -path './node_modules/*' -print | sort
rg -n "skills/|\\.agents|docs/agent|AGENTS\\.md" AGENTS.md README.md docs recipes templates apps packages .github --glob '!**/node_modules/**' --glob '!**/dist/**' --glob '!**/storybook-static/**' --glob '!**/.next/**'
find .agents/skills -maxdepth 3 -name SKILL.md -print
git diff --check
pnpm format:check
```

Codex 인식 문제가 있으면 Codex 세션을 재시작합니다. Codex는 새 세션을 시작할 때 instruction chain을 다시 구성합니다.

## Official References

- [AGENTS.md discovery](https://developers.openai.com/codex/guides/agents-md)
- [Skills discovery](https://developers.openai.com/codex/skills)
