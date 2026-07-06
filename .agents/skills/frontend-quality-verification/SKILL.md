---
name: frontend-quality-verification
description: DONGCHIMI-CLIENT 프론트엔드 변경 후 변경 범위 기준으로 format, lint, typecheck, build 검증을 계획하고 실행할 때 사용합니다.
---

# 프론트엔드 품질 검증

## 목적

변경 범위에 맞는 검증 명령을 선택합니다.

## 입력 점검

### 필수 입력

- 변경 파일 또는 예상 workspace

### 있으면 좋은 입력

- 검증 깊이: docs-only, targeted workspace, full root verification
- known failure 또는 현재 무시해야 할 외부 실패
- UI, Storybook, mobile 검증 필요 여부

변경 파일이 주어지지 않았으면 먼저 `git diff --name-only`와 `git status --short`로 범위를 확인합니다.

## 읽기 전략

- 항상 읽기: 없음
- 조건부 읽기:
  - `docs/workflows/local-development.md`: 명령이 헷갈릴 때
  - `docs/workflows/ci.md`: CI와 같은 검증 범위를 맞춰야 할 때
  - `.agents/skills/frontend-fundamentals-review/SKILL.md`: 코드 품질 리뷰까지 요청받았거나 PR 전 품질 점검이 필요할 때
  - 관련 workspace `package.json`: workspace 전용 script가 필요한 때
  - `docs/conventions/package-management.md`: package manager가 불명확할 때

## 검증 단계

현재 문서-only 변경:

```bash
git diff --check
```

agent 문서 구조 변경:

```bash
rg -n "docs/agent|\\.agents|templates/|recipes/" AGENTS.md README.md docs recipes templates
find .agents/skills -maxdepth 3 -name SKILL.md -print
git diff --check
```

package script가 있는 변경은 가벼운 검증에서 무거운 검증으로 진행합니다.

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm check:icons
pnpm build
```

package manager는 `docs/conventions/package-management.md`를 따릅니다.

코드 품질 자체를 검토해야 하면 명령 검증과 별도로 `frontend-fundamentals-review`를 실행합니다.

## Workspace 매핑

현재 예정 매핑:

| 경로 | Check |
| --- | --- |
| `apps/client/**` | client app lint/typecheck/build |
| `apps/design-system-web/**` | design-system web lint/typecheck/build |
| `apps/admin/**` | admin app lint/typecheck/build, 앱이 생성된 뒤 적용 |
| `apps/mobile/**` | web check와 별도 mobile command |
| `packages/design-system/**` | design-system lint/typecheck/test/check:icons/build/storybook |
| `packages/shared/**` | 소비 app build 필요 여부 확인 |
| `docs/**`, `recipes/**`, `templates/**`, `.agents/**` | `git diff --check` + format check if available |

실제 workspace가 생기면 이 표를 script 이름과 함께 갱신합니다.

## 출력 형식

```markdown
## Verification Report

| Command | Status | Notes |
| --- | --- | --- |
| `git diff --check` | PASS | - |

Residual risk:
- <확인하지 못한 영역과 이유>
```

## 예외

- 문서-only 변경은 `git diff --check`에서 멈출 수 있습니다.
- 아이콘 source, generated output, icon script, root `check:icons`, CI icon step 변경은 `pnpm check:icons`를 포함합니다.
- package script가 없는 상태에서 npm 검증을 성공한 것으로 쓰지 않습니다.
- web build 성공을 native/mobile 검증으로 간주하지 않습니다.
