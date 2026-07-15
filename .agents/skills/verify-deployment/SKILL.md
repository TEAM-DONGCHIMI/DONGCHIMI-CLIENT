---
name: verify-deployment
description: Vercel 배포 설정, app별 root/build, preview/production smoke, 404 fallback, production branch caveat를 검증할 때 사용합니다.
---

# 배포 검증

## 목적

배포 설정과 실제 검증 표면을 분리해 기록합니다.

- Vercel project와 monorepo app root가 맞는지 확인합니다.
- protected preview와 public production alias 검증을 구분합니다.
- `develop` PR과 Vercel `productionBranch` 설정이 충돌하지 않는지 확인합니다.
- Next app과 Vite SPA의 404 fallback 책임을 분리합니다.

## 입력 점검

```bash
git diff --name-only HEAD -- vercel.json .vercelignore apps/client apps/market-owner docs/workflows/deployment.md docs/workflows/pr-checklist.md
```

배포 관련 파일이나 문서가 없으면 `SKIP`입니다.

## 읽기 전략

1. 배포 문서가 있으면 `docs/workflows/deployment.md`를 우선합니다.
2. app별 `package.json`, `next.config.mjs`, `vite.config.ts`, `vercel.json`을 확인합니다.
3. PR target branch와 Vercel production branch를 별도 근거로 확인합니다.
4. browser smoke는 실제 접근 가능한 URL 기준으로만 기록합니다.

## Workflow

### Step 1: 배포 파일 존재 확인

```bash
find . apps -maxdepth 3 \( -name 'vercel.json' -o -name '.vercelignore' \) -print | sort
```

### Step 2: app별 root/build 설정 확인

- `apps/client`: Next app, port `3000`, build는 해당 workspace script 기준입니다.
- `apps/market-owner`: Vite React SPA, port `5173`, build는 `market-owner` workspace script 기준입니다.
- Vercel project가 하나인지 app별 project인지 문서와 실제 설정을 비교합니다.

### Step 3: 404 fallback 책임 확인

- Next app은 `apps/client/src/app/not-found.tsx`를 우선 확인합니다.
- Vite SPA는 `apps/market-owner/vercel.json` rewrite와 app-side unknown route UI를 함께 확인합니다.
- SPA rewrite가 soft 404 tradeoff를 만들면 PR risk에 남깁니다.

### Step 4: smoke 검증 기록

가능한 경우 아래 순서로 확인합니다.

1. protected preview 또는 share path에서 title/body/favicon 확인
2. production alias promote 여부 확인
3. public production URL에서 title/body/favicon/console error 확인

브라우저 접근이 막히면 `protected preview blocked`처럼 blocker를 기록합니다.

### Step 5: 로컬 검증

변경 범위에 맞춰 실행합니다.

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

## 완료 기준

- 배포 설정 변경이 없으면 `SKIP`입니다.
- app root/build/production branch/404 fallback/smoke evidence가 구분되어 기록됩니다.
- preview와 production 검증 결과를 서로 대체하지 않습니다.

## 예외

- `.vercel` local state는 커밋 대상이 아니며 `.gitignore` 또는 작업 환경 산출물로 다룹니다.
- Vercel 보호 페이지 때문에 preview가 막히면 public production smoke와 혼동하지 않습니다.
- connector나 권한 문제가 있으면 exact blocker를 남기고 성공으로 쓰지 않습니다.
