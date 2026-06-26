---
name: verify-e2e-smoke
description: Playwright E2E smoke 설정, 앱별 smoke spec, 고정 포트, artifact upload 범위를 검증할 때 사용합니다.
---

# E2E Smoke 검증

## 목적

root Playwright smoke lane이 전체 E2E 플랫폼으로 과확장되거나, 반대로 실제 smoke 신뢰성을 잃는 것을 막습니다.

## 입력 점검

```bash
git diff --name-only HEAD -- playwright.config.ts apps/client/e2e apps/market-owner/e2e .github/workflows/e2e.yml docs/workflows/e2e-testing.md docs/workflows/local-development.md docs/workflows/pr-checklist.md package.json
```

Playwright 설정과 e2e 파일이 아직 없으면 `SKIP`입니다.

## 읽기 전략

1. `docs/workflows/e2e-testing.md`가 있으면 먼저 읽습니다.
2. `docs/workflows/local-development.md`에서 app별 fixed port를 확인합니다.
3. `playwright.config.ts`, app별 `e2e` spec, `.github/workflows/e2e.yml`을 비교합니다.
4. root `package.json` script가 문서와 일치하는지 확인합니다.

## Workflow

### Step 1: 적용 대상 확인

```bash
test -f playwright.config.ts || echo "SKIP: no root Playwright config"
find apps -path '*/e2e/*.spec.ts' -print 2>/dev/null | sort
```

### Step 2: smoke scope 확인

- smoke spec는 각 app 첫 화면 또는 기본 shell이 뜨는지만 확인합니다.
- API seeding, MSW E2E, visual regression, screenshot snapshot은 별도 lane으로 둡니다.
- PR에서는 smoke와 full browser run 차이를 설명합니다.

### Step 3: fixed port 확인

- `apps/client`: `3000`
- `apps/market-owner`: `5173`
- Vite가 `127.0.0.1`에서 실패하면 `localhost:5173` 재시도를 먼저 고려합니다.

### Step 4: workflow artifact 확인

- 실패 시 `playwright-report`와 `test-results`를 업로드하는지 확인합니다.
- workflow file push가 막히면 GitHub token workflow scope 문제로 보고합니다.

### Step 5: 실행

script가 있으면 실행합니다.

```bash
pnpm e2e:install
pnpm e2e:smoke
```

script가 없으면 root Playwright setup이 아직 없는 것으로 `SKIP`합니다.

## 완료 기준

- root Playwright config가 없으면 `SKIP`입니다.
- config가 있으면 app별 smoke, fixed port, artifact, local command가 서로 일치합니다.
- 브라우저-visible CI pass와 로컬 재실행 여부를 구분합니다.

## 예외

- full E2E, visual regression, API seed, screenshot snapshot은 smoke lane의 필수 조건이 아닙니다.
- dev server attach 실패는 product failure와 tool friction을 분리해 기록합니다.
- workflow permission blocker를 검증 성공으로 쓰지 않습니다.
