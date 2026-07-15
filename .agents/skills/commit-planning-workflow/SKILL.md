---
name: commit-planning-workflow
description: 커밋 요청 또는 PR 준비 시 실제 diff를 기능, 작업, 검증 단위로 분해하고 stage/commit 계획을 작성할 때 사용합니다.
---

# 커밋 계획 워크플로

## 목적

커밋을 만들기 전에 실제 diff를 기준으로 기능/작업 단위를 나눕니다.

커밋 수는 1~2개로 제한하지 않습니다. 독립적으로 리뷰, revert, 검증 가능한 단위라면 필요한 만큼 나눕니다.

## 입력 점검

- Jira key 또는 branch 이름
- 현재 변경 파일 목록
- 사용자가 원하는 커밋 범위
- 제외해야 할 사용자 변경, local config, secret 파일

Jira key가 없으면 현재 branch, Jira 본문, 가까운 문서에서 먼저 확인합니다.
확인할 수 없으면 커밋 전 사용자에게 묻습니다.

## 읽기 전략

항상 확인합니다.

- `docs/conventions/git.md`
- `recipes/commit-plan.md`
- `docs/workflows/pr-checklist.md`

실제 diff 확인:

```bash
git status --short
git diff --name-only
git diff --stat
```

이미 stage된 파일이 있으면 추가로 확인합니다.

```bash
git diff --cached --name-only
git diff --cached --stat
```

## 분해 기준

아래 중 하나라도 다르면 별도 커밋을 우선 고려합니다.

- Jira child issue 또는 완료 기준이 다름
- 변경 surface가 다름: page, component, hook, API, story/test, docs/spec, generator, config/CI/dependency
- review owner 또는 리뷰 관점이 다름
- revert 단위가 다름
- 검증 명령 또는 브라우저 확인 범위가 다름
- 순수 refactor/rename/remove와 기능 동작 변경이 섞임

## 권장 커밋 그룹

프론트엔드 기능:

1. spec 또는 문서
2. scaffold 또는 generator 산출물
3. API/type/query/hook
4. page shell 또는 route
5. component interaction 또는 state
6. story/test/fixture
7. polish 또는 verification fix

agent harness 또는 문서 작업:

1. docs index, convention, workflow
2. skills
3. recipes, templates
4. config, hooks, PR template
5. 검증 중 발견한 후속 정리

config 또는 CI가 기능 변경과 함께 있으면 별도 커밋으로 분리합니다.

## 메인 작업 흐름

1. `git status --short`와 diff 목록을 확인합니다.
2. secret 또는 local-only 파일이 보이면 제외합니다.
3. 변경 파일을 분해 기준에 맞춰 그룹화합니다.
4. `Commit Plan`을 작성합니다.
5. 커밋별로 명시적 path staging을 사용합니다.
6. 각 커밋 전에 `git diff --cached --name-only`와 `git diff --cached --check`를 확인합니다.
7. `docs/conventions/git.md` 형식으로 커밋합니다.
8. 남은 변경 파일이 있는지 다시 확인합니다.

## 출력 형식

```markdown
## Commit Plan

- Commit 1: `prefix(scope): JIRAKEY summary`
  - files:
  - reason:
  - verification:
- Commit 2: `prefix(scope): JIRAKEY summary`
  - files:
  - reason:
  - verification:
```

커밋 후 요약:

```markdown
## Commit Summary

- created:
- remaining:
- verification:
- excluded:
```

## 예외

- 한 줄 수정처럼 review/revert/검증 단위가 하나뿐이면 단일 커밋으로 둡니다.
- 지나치게 작은 커밋이 오히려 review를 어렵게 만들면 같은 목적의 변경끼리 묶습니다.
- 사용자가 명시적으로 squash 또는 단일 커밋을 요구하면 그 지시를 따르되, 리스크가 있으면 먼저 설명합니다.
