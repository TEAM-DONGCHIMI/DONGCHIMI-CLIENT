---
name: verify-github-workflows
description: GitHub Actions, labeler, CODEOWNERS, PR template 변경 후 trigger, permission, concurrency, secret 노출을 검증할 때 사용합니다.
---

# GitHub Workflow 검증

## 목적

GitHub 자동화 변경이 권한 과다, trigger 누락, secret 노출, PR review noise를 만들지 않도록 확인합니다.

## 입력 점검

```bash
git diff --name-only HEAD -- .github docs/workflows/ci.md docs/workflows/pr-checklist.md docs/workflows/pull-request-writing.md
```

`.github` 또는 workflow 문서 변경이 없으면 문서-only 변경 여부에 따라 `SKIP`할 수 있습니다.

## 읽기 전략

1. `.github/workflows/*.yml`을 변경된 파일부터 읽습니다.
2. `docs/workflows/ci.md`, `docs/workflows/pr-checklist.md`, `docs/workflows/pull-request-writing.md`를 확인합니다.
3. label 변경이면 `.github/labeler.yml`과 PR template label 기대를 같이 봅니다.
4. reviewer/owner 변경이면 `.github/CODEOWNERS`를 같이 봅니다.

## Workflow

### Step 1: workflow 파일 목록 확인

```bash
find .github/workflows -maxdepth 1 -type f \( -name '*.yml' -o -name '*.yaml' \) -print | sort
```

### Step 2: trigger와 권한 확인

- repo 검증 workflow는 `pull_request`, `push` to `main`/`develop` 기준을 따릅니다.
- PR comment, label, assign, review 관련 workflow는 필요한 최소 permission만 사용합니다.
- workflow가 PR마다 comment를 남기면 중복 comment update 또는 concurrency 전략을 검토합니다.

검토 보조 명령:

```bash
rg -n "^(on:|permissions:|concurrency:|  pull-requests:|  issues:|  contents:)" .github/workflows
```

### Step 3: secret 노출 검사

```bash
rg -n "ATATT|ghp_|github_pat_|sk-[A-Za-z0-9_-]{20,}|DISCORD_WEBHOOK=https?://|ATLASSIAN_API_TOKEN=[^[:space:]\"']+" .github docs recipes templates AGENTS.md README.md
```

PASS: 출력이 없습니다.

### Step 4: labeler와 PR template 정합성 확인

- `.github/labeler.yml`의 label 이름이 실제 PR template/checklist에서 기대하는 용어와 충돌하지 않는지 봅니다.
- 테스트 관련 파일이 생기면 `TEST` 또는 동등 label rule이 누락되지 않았는지 확인합니다.
- rename-only 규칙이 과도하게 잡히지 않는지 확인합니다.

### Step 5: CODEOWNERS 확인

```bash
test -f .github/CODEOWNERS && sed -n '1,200p' .github/CODEOWNERS || echo "SKIP: no CODEOWNERS"
```

- owner가 실제 GitHub team/user인지 PR에서 재확인합니다.
- broad pattern이 모든 변경에 과도한 reviewer를 요구하지 않는지 확인합니다.

## 완료 기준

- workflow trigger, permission, secret, concurrency 또는 중복 comment 전략을 검토했습니다.
- labeler/CODEOWNERS/PR template이 서로 모순되지 않습니다.
- 실행한 검증과 브라우저에서만 확인한 check status를 구분해 보고합니다.

## 예외

- GitHub UI에서만 보이는 check result는 로컬 검증 성공으로 쓰지 않습니다.
- workflow auth/scope 문제는 구현 실패가 아니라 배포/권한 blocker로 분리해 보고합니다.
- 실제 secret 값은 출력하거나 PR 본문에 넣지 않습니다.
