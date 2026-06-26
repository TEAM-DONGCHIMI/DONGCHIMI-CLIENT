---
name: manage-skills
description: 세션 변경사항을 분석하여 verify 스킬 커버리지 누락, 오래된 참조, 누락된 검사를 탐지하고 필요한 skill 유지보수 액션을 제안합니다.
---

# 세션 기반 스킬 유지보수

## Purpose

현재 세션에서 변경된 내용을 분석하여 verify skill의 드리프트를 탐지하고 수정합니다.

1. 커버리지 누락: 어떤 verify skill에서도 참조하지 않는 변경 파일
2. 유효하지 않은 참조: 삭제되거나 이동된 파일을 참조하는 skill
3. 누락된 검사: 기존 검사에서 다루지 않는 새로운 패턴이나 규칙
4. 오래된 값: 현재 코드와 맞지 않는 설정값, 탐지 명령어, 파일 경로

## When To Run

- 새로운 패턴이나 규칙을 도입한 뒤 verify skill 커버리지를 점검할 때
- 기존 verify skill을 수정하고 일관성을 확인할 때
- PR 전에 변경된 영역이 검증 skill로 커버되는지 확인할 때
- 검증 실행 시 예상했던 이슈를 놓쳤을 때
- 새로운 repo-local skill을 만들기 전에 skill 이름, 위치, frontmatter, 관련 docs/recipes 갱신 범위를 확인할 때

## Skill Storage

DONGCHIMI-CLIENT의 repo skill은 모두 `.agents/skills` 아래에 직접 둡니다.

```text
.agents/skills/
  manage-skills/SKILL.md
  verify-implementation/SKILL.md
  verify-<name>/SKILL.md
```

새 verify skill을 만들 때는 `.agents/skills/verify-<name>/SKILL.md`에 생성합니다.
일반 workflow skill을 만들 때도 `.agents/skills/<name>/SKILL.md`에 생성합니다.

## New Skill Authoring Rules

새 skill을 만들기 전 아래를 먼저 확인합니다.

- 기존 skill로 해결 가능한지
- 새 skill이 workflow, verify, reasoning 중 어느 종류인지
- 연결할 source of truth 문서: `docs/`, `recipes/`, `templates/`
- frontmatter `name`, `description`이 있는지
- skill 이름은 kebab-case인지
- skill이 실제 파일 경로와 현재 app/package 구조를 가정하지 않는지
- 필요하면 `docs/agent/index.md`, `docs/agent/indexing.md`, `docs/index.md`, `AGENTS.md`에 링크를 추가했는지

일반 workflow skill 필수 섹션:

- `목적`
- `입력 점검`
- `읽기 전략`
- `메인 작업 흐름`
- `완료 기준`
- `예외`

## Registered Verify Skills

| Skill                         | Description                                                      | Covered file patterns                                                                                                                                                                        |
| ----------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verify-agent-docs`           | agent harness와 markdown 문서 구조 검증                          | `AGENTS.md`, `README.md`, `docs/**`, `recipes/**`, `templates/**`, `.agents/**`, `.github/**`                                                                                                |
| `verify-design-system-icons`  | 디자인시스템 아이콘 source/generated/export/SVG 정책 검증        | `packages/design-system/src/icons/**`, `packages/design-system/scripts/*icon*.mjs`, `packages/design-system/package.json`, `docs/architecture/design-system-icons.md`, `recipes/add-icon.md` |
| `verify-design-system-styles` | 디자인시스템 style helper와 vanilla-extract public boundary 검증 | `packages/design-system/src/styles/**`, `packages/design-system/package.json`, `docs/architecture/styling-and-design-tokens.md`                                                              |
| `verify-github-workflows`     | GitHub workflow, labeler, CODEOWNERS, PR template 검증           | `.github/**`, `docs/workflows/ci.md`, `docs/workflows/pr-checklist.md`, `docs/workflows/pull-request-writing.md`                                                                             |
| `verify-deployment`           | app별 배포 설정, Vercel smoke, 404 fallback 검증                 | `vercel.json`, `.vercelignore`, `apps/**/vercel.json`, `apps/client/**`, `apps/market-owner/**`, `docs/workflows/deployment.md`                                                              |
| `verify-route-boundaries`     | app/domains/shared/packages 책임과 import 방향 검증              | `apps/**`, `packages/**`, `turbo/generators/**`, `docs/architecture/app-structure.md`, `docs/architecture/market-owner-app.md`                                                               |
| `verify-e2e-smoke`            | Playwright E2E smoke 설정과 app별 smoke spec 검증                | `playwright.config.ts`, `apps/**/e2e/**`, `.github/workflows/e2e.yml`, `docs/workflows/e2e-testing.md`, `docs/workflows/local-development.md`                                                |
| `verify-performance-budget`   | Lighthouse CI report-only baseline과 성능 workflow 검증          | `lighthouserc.cjs`, `scripts/performance/**`, `.github/workflows/performance.yml`, `docs/workflows/performance-budget.md`, `package.json`                                                    |

## Workflow

### Step 1: 세션 변경사항 분석

현재 세션에서 변경된 파일을 수집합니다.

```bash
git diff HEAD --name-only
git diff --name-only
git status --short
```

중복을 제거하고, 최상위 디렉터리 기준으로 그룹화합니다.

### Step 2: 등록된 verify skill과 변경 파일 매핑

`Registered Verify Skills` 섹션을 기준으로 파일-스킬 매핑을 만듭니다.

등록된 verify skill이 없으면 모든 변경 파일을 `UNCOVERED`로 처리하고 Step 4로 이동합니다.

### Step 3: 영향받은 skill의 커버리지 갭 분석

매칭된 변경 파일이 있는 각 verify skill에 대해 전체 `SKILL.md`를 읽고 확인합니다.

- 누락된 파일 참조
- 오래된 탐지 명령어
- 커버되지 않은 새 패턴
- 삭제된 파일의 잔여 참조
- 변경된 값

### Step 4: CREATE vs UPDATE 결정

커버되지 않은 파일 그룹마다 다음 기준을 적용합니다.

```text
IF 기존 verify skill의 도메인과 관련됨:
  -> 기존 skill UPDATE
ELSE IF 3개 이상의 관련 파일이 공통 규칙/패턴을 공유함:
  -> 새 verify skill CREATE
ELSE:
  -> 면제
```

사용자에게 제안 액션을 보여주고 확인받습니다.

### Step 5: 기존 skill 업데이트

사용자가 승인한 기존 skill만 수정합니다.

- 아직 유효한 기존 검사는 제거하지 않습니다.
- 새 파일은 `Related Files`에 추가합니다.
- 코드베이스에서 삭제가 확인된 파일 참조만 제거합니다.
- 변경된 식별자, 설정 키, 파일명은 현재 코드 기준으로 업데이트합니다.

### Step 6: 새 verify skill 생성

새 skill 생성 전 반드시 사용자에게 skill 이름을 확인합니다.

이름 규칙:

- 반드시 `verify-`로 시작합니다.
- 사용자가 접두사 없이 제공하면 `verify-`를 붙이고 알립니다.
- kebab-case를 사용합니다.

생성 후 반드시 업데이트합니다.

- 이 파일의 `Registered Verify Skills`
- `.agents/skills/verify-implementation/SKILL.md`의 `Execution Targets`
- `docs/agent/index.md` 또는 `docs/agent/indexing.md`의 skill 구조 설명이 바뀐 경우 해당 문서

### Step 6-2: 새 workflow skill 생성

workflow skill 생성 전에는 사용자에게 이름과 목적을 확인합니다. 단, 사용자가 특정 작업 유형과 필요한 skill을 명확히 지정했고 기존 문서에서 같은 패턴이 확인되면 바로 생성할 수 있습니다.

생성 위치:

```text
.agents/skills/<name>/SKILL.md
```

선택적으로 UI 호출 메타데이터가 필요하면 아래 파일을 추가합니다.

```text
.agents/skills/<name>/agents/openai.yaml
```

### Step 7: 검증

모든 편집 후 확인합니다.

```bash
find .agents/skills -maxdepth 3 -name SKILL.md -print
git diff --check
```

package script가 있으면 `docs/workflows/local-development.md` 기준 검증도 실행합니다.

## Related Files

| File                                            | Purpose                          |
| ----------------------------------------------- | -------------------------------- |
| `.agents/skills/manage-skills/SKILL.md`         | 이 skill 자체                    |
| `.agents/skills/verify-implementation/SKILL.md` | 통합 verify 실행 skill           |
| `.agents/skills/verify-*/SKILL.md`              | 생성되는 verify skill            |
| `docs/agent/indexing.md`                        | skill discovery와 저장 구조 문서 |

## Exceptions

- lock 파일, 빌드 출력물, generated file은 보통 verify skill 커버리지가 필요 없습니다.
- 단순 문서 변경은 새 verify skill을 만들지 않습니다.
- `AGENTS.md` 자체 변경은 일반적으로 문서 변경으로 면제합니다.
- CI/CD 설정은 애플리케이션 패턴 verify skill이 아니라 별도 운영 정책으로 다룹니다.
