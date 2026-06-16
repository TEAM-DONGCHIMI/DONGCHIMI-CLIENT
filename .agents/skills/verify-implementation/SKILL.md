---
name: verify-implementation
description: 등록된 verify-* 스킬을 순차 실행하여 통합 검증 보고서를 생성합니다. 기능 구현 후, PR 전, 코드 리뷰 시 사용합니다.
---

# 구현 검증

## Purpose

프로젝트에 등록된 모든 `verify-*` skill을 순차적으로 실행하여 통합 검증을 수행합니다.

1. 각 verify skill의 `Workflow`에 정의된 검사를 실행합니다.
2. 각 verify skill의 `Exceptions`를 참조하여 false positive를 줄입니다.
3. 발견된 이슈에 대해 파일, 원인, 수정 방법을 제시합니다.
4. 필요한 경우 사용자 승인 후 수정과 재검증을 진행합니다.

## When To Run

- 새로운 기능을 구현한 후
- Pull Request를 생성하기 전
- 코드 리뷰 중
- 코드베이스 규칙 준수 여부를 감사할 때
- `/manage-skills`로 verify skill을 추가하거나 수정한 뒤

## Skill Storage

verify skill은 `.agents/skills` 아래에 직접 둡니다.

```text
.agents/skills/verify-<name>/SKILL.md
```

## Execution Targets

| # | Skill | Description |
| --- | --- | --- |
| 1 | `verify-agent-docs` | agent harness와 markdown 문서 구조 검증 |

`verify-implementation` 자신과 `manage-skills`는 실행 대상에 포함하지 않습니다.

## Workflow

### Step 1: 실행 대상 확인

`Execution Targets` 섹션의 verify skill 목록을 확인합니다.

등록된 skill이 없으면 다음 메시지를 출력하고 종료합니다.

```markdown
## 구현 검증

등록된 verify skill이 없습니다. `/manage-skills`를 실행하여 프로젝트에 맞는 verify skill을 생성하세요.
```

### Step 2: 순차 실행

각 verify skill에 대해 다음을 수행합니다.

1. `.agents/skills/verify-<name>/SKILL.md`를 읽습니다.
2. `Related Files`, `Workflow`, `Exceptions` 섹션을 확인합니다.
3. `Workflow`에 정의된 탐지 명령어를 실행합니다.
4. 결과를 각 step의 PASS/FAIL 기준에 대조합니다.
5. `Exceptions`에 해당하는 결과는 면제 처리합니다.
6. FAIL이면 파일 경로, 라인, 문제, 수정 방법을 기록합니다.

### Step 3: 통합 보고서

모든 verify skill 실행 후 결과를 통합합니다.

```markdown
## 구현 검증 보고서

### 요약

| Skill | Status | Issues | Detail |
| --- | --- | --- | --- |
| `verify-<name>` | PASS | 0 | 모든 검사 통과 |
```

## Output Format

최종 출력에는 다음을 포함합니다.

- 실행한 verify skill 목록
- skill별 PASS/FAIL 상태
- 발견된 이슈 수
- 자동 수정 여부
- 재검증 결과
- 수동 확인이 필요한 잔여 이슈

## Related Files

| File | Purpose |
| --- | --- |
| `.agents/skills/manage-skills/SKILL.md` | verify skill 등록 목록을 관리 |
| `.agents/skills/verify-implementation/SKILL.md` | 이 skill 자체 |
| `.agents/skills/verify-*/SKILL.md` | 실행 대상 verify skill |

## Exceptions

- 등록된 verify skill이 없는 상태는 오류가 아닙니다.
- `verify-implementation` 자신은 실행 대상에 포함하지 않습니다.
- `manage-skills`는 `verify-`로 시작하지 않으므로 실행 대상에 포함하지 않습니다.
- 각 verify skill의 `Exceptions` 섹션에 명시된 패턴은 이슈로 보고하지 않습니다.
