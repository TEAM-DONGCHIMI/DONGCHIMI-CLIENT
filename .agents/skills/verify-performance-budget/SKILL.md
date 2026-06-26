---
name: verify-performance-budget
description: Lighthouse CI performance budget 설정, report-only baseline, app별 측정 대상, PR comment 산출물을 검증할 때 사용합니다.
---

# Performance Budget 검증

## 목적

성능 예산 작업이 측정 조건 없이 수치만 남기거나, 초기 baseline 단계에서 release gate로 과확장되는 것을 막습니다.

## 입력 점검

```bash
git diff --name-only HEAD -- lighthouserc.cjs scripts/performance .github/workflows/performance.yml docs/workflows/performance-budget.md package.json
```

성능 예산 파일이 없으면 `SKIP`입니다.

## 읽기 전략

1. `docs/workflows/performance-budget.md`가 있으면 먼저 읽습니다.
2. `lighthouserc.cjs`에서 측정 URL, budget, upload target을 확인합니다.
3. `scripts/performance/*`가 있으면 dev server orchestration과 PR comment 책임을 확인합니다.
4. `.github/workflows/performance.yml`이 있으면 trigger, permission, artifact/comment 정책을 확인합니다.

## Workflow

### Step 1: 적용 대상 확인

```bash
test -f lighthouserc.cjs || echo "SKIP: no Lighthouse CI config"
find scripts/performance .github/workflows -maxdepth 2 -type f 2>/dev/null | sort | rg "performance|lighthouse|lhci" || true
```

### Step 2: report-only baseline 확인

- 초기 성능 예산은 report-only로 시작합니다.
- hard fail 기준을 추가하려면 별도 Jira나 명시적 기준이 있어야 합니다.
- 측정 대상은 `apps/client`와 `apps/market-owner`의 `/`처럼 문서화된 URL이어야 합니다.

### Step 3: 측정 조건 확인

PR 본문 또는 docs에 아래가 있어야 합니다.

- branch 또는 commit
- app과 URL
- tool과 mode
- run count
- raw value와 해석
- 악화된 metric이 있으면 원인 또는 follow-up

### Step 4: workflow 권한 확인

- PR comment가 있으면 필요한 permission이 최소 범위인지 확인합니다.
- comment script는 secret이나 raw env를 출력하지 않아야 합니다.
- artifact 또는 report URL이 있으면 접근 가능성을 기록합니다.
- `.lighthouseci`, `lighthouse-report`, generated HTML/JSON report는 커밋 대상이 아니며 ignore 규칙에 포함되어야 합니다.

### Step 5: 실행

script가 있으면 실행합니다.

```bash
pnpm build
pnpm perf
```

script가 없으면 설정 baseline 미완료로 `SKIP` 또는 blocker를 보고합니다.

## 완료 기준

- 성능 예산 파일이 없으면 `SKIP`입니다.
- 파일이 있으면 report-only 여부, 측정 URL, raw metric, PR comment/artifact, 실행 명령이 확인됩니다.
- release gate로 바꾸는 변경은 별도 근거가 있습니다.

## 예외

- Vercel Analytics, Sentry production monitoring, long-term dashboard는 이 skill의 필수 범위가 아닙니다.
- dev server 기반 Lighthouse 결과와 production measurement는 같은 증거로 취급하지 않습니다.
- 단순 문서 변경이면 `pnpm perf`를 실행하지 않을 수 있습니다.
