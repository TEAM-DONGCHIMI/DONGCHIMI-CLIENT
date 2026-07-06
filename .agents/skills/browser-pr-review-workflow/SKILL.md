---
name: browser-pr-review-workflow
description: GitHub 브라우저 PR 리뷰에서 visible diff, review comment, check status, local verification 여부를 분리해 기록할 때 사용합니다.
---

# Browser PR Review Workflow

## 목적

브라우저에서 본 PR diff와 로컬에서 검증한 사실을 섞지 않도록 합니다.

이 workflow는 리뷰 코멘트 작성과 PR 상태 파악을 돕지만, 브라우저 화면만으로 구현 완료나 로컬 검증 성공을 주장하지 않습니다.

## 입력 점검

- GitHub PR URL 또는 PR 번호
- repo와 branch 이름
- 사용자가 원하는 출력: 리뷰 코멘트, 승인/보류 판단, PR body 개선, check 상태 요약
- 로컬 checkout을 함께 볼지 여부

## 읽기 전략

1. PR title, base/head branch, linked Jira를 먼저 확인합니다.
2. changed files에서 실제 리뷰 표면을 파일/라인 기준으로 모읍니다.
3. unresolved review thread, CodeRabbit/Copilot/comment thread를 먼저 확인해 이미 제기된 finding을 표시합니다.
4. visible check status와 CodeRabbit/Copilot/comment thread를 분리합니다.
5. FE 코드 diff가 있으면 `frontend-fundamentals-review`와 `docs/code-quality/frontend-fundamentals.md`를 함께 적용합니다.
6. 로컬 checkout을 쓰면 `git status --short --branch`와 현재 branch가 PR head와 같은지 확인합니다.
7. repo 문서나 workflow 기준이 필요한 경우 `docs/index.md`에서 가장 가까운 source of truth를 찾습니다.

## 메인 작업 흐름

### Step 1: Review Surface 기록

아래 정보를 짧게 기록합니다.

```markdown
- PR:
- Base / Head:
- Jira:
- PR state:
- Head commit:
- Review surface:
- Existing threads:
- Visible checks:
- Preview / Storybook / Chromatic:
- Local checkout:
```

`PR state`에는 draft/ready/merged 여부, approval/change request 상태, merge conflict 또는 mergeability, pushed commit/rebase 여부를 구분해 적습니다.
`Existing threads`에는 CodeRabbit, Copilot, teammate review 중 이미 같은 내용을 다룬 thread를 표시합니다.

### Step 2: 파일 단위 검토

- 코드 변경이면 bug, regression, missing test, boundary violation을 우선합니다.
- FE 코드 변경이면 Frontend Fundamentals의 Readability, Predictability, Cohesion, Coupling 기준을 모두 적용합니다.
- docs/workflow 변경이면 source of truth 중복, stale reference, 실행 불가능한 명령을 봅니다.
- GitHub workflow 변경이면 trigger, permission, concurrency, secret, duplicate comment를 봅니다.
- 디자인시스템 또는 shared UI 변경이면 public API, link/action semantics, ARIA role과 keyboard/focus behavior, React ref 방식, story/spec 동기화를 같이 봅니다.

### Step 3: 코멘트 작성

코멘트는 복붙 가능한 형태로 작성합니다.

- 파일/라인 또는 section을 명시합니다.
- 문제와 영향, 제안 수정을 함께 적습니다.
- 브라우저에서만 본 사실은 `visible diff 기준`처럼 표시합니다.
- 기존 CodeRabbit 또는 reviewer thread와 같은 내용이면 새 코멘트를 쓰지 않고 "이미 커버됨"으로 기록합니다.
- 여러 PR을 한 번에 리뷰할 때는 PR별로 review surface, 기존 thread, 남길 코멘트를 분리합니다.

### Step 4: 검증 상태 분리

아래 표현을 구분합니다.

- `브라우저에서 Verify check 통과가 보임`
- `로컬에서 pnpm build 실행 통과`
- `PR diff만 확인했고 로컬 검증은 하지 않음`
- `Storybook/Chromatic preview에서 wrapper 배경이나 Connection lost가 보임`

Storybook, Chromatic, Figma preview에서 보이는 wrapper 배경, Node engine warning, connection loss는 component defect와 분리합니다.

### Step 5: 후속 작업 라우팅

반복되는 리뷰 포인트가 repo policy로 남아야 하면 `manage-skills` 또는 관련 docs/workflow 수정 이슈로 분리합니다.

## 완료 기준

- 리뷰 결과가 파일/라인 또는 PR section에 붙일 수 있을 정도로 구체적입니다.
- visible check와 local command result가 분리되어 있습니다.
- merge 가능/불가능 판단은 현재 증거 범위로 제한됩니다.

## 예외

- 브라우저 PR review는 로컬 구현 완료 증거가 아닙니다.
- GitHub check가 green이어도 connector/browser auth 상태나 local branch 상태는 별도로 확인해야 합니다.
- 사용자가 PR body만 고치라고 한 경우 로컬 code change를 만들지 않습니다.
