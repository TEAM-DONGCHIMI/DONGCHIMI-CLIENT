# CI

DONGCHIMI-CLIENT의 기본 CI는 GitHub Actions에서 실행합니다.

## Workflow

Workflow files:

- `.github/workflows/auto-assign.yml`
- `.github/workflows/auto-label.yml`
- `.github/workflows/chromatic.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/discord-notify.yml`
- `.github/workflows/e2e.yml`
- `.github/workflows/performance.yml`

Trigger:

- `pull_request`
- `push` to `main`
- `push` to `develop`

Runtime:

- Node.js: `.node-version`
- pnpm: root `package.json`의 `packageManager`
- dependency install: `pnpm install --frozen-lockfile`

## Pipeline

Base verification:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm check:icons
pnpm build
```

Performance verification:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm perf
```

## E2E Workflow

E2E는 기본 CI와 분리된 `.github/workflows/e2e.yml`에서 실행합니다. 기준은 [E2E Testing](./e2e-testing.md)을 따릅니다.

`pull_request`에서는 Chromium smoke만 실행합니다.

```bash
pnpm e2e:smoke
```

`workflow_dispatch`에서는 전체 Playwright project를 실행합니다.

```bash
pnpm e2e
```

실패 시 `playwright-report`와 `test-results`를 artifact로 업로드합니다.

## Scope

- web build와 native mobile build를 같은 성공 조건으로 보지 않습니다.
- PR blocking E2E는 초기에는 Chromium smoke로 제한합니다.
- Markdown 파일은 root Prettier 검증 대상입니다.
- Design-system icon source/generated/export drift는 root `pnpm check:icons`로 검증합니다.
- Lighthouse CI는 별도 workflow에서 실행하고 report artifact를 남깁니다.
- Turborepo remote cache 또는 CI cache는 별도 Jira 이슈로 다룹니다.
- secret, token, raw `.env` 값은 CI log에 출력하지 않습니다.
- Vercel Git 연동이 활성화되면 배포는 [Deployment](./deployment.md) 기준을 따릅니다.

## When CI Fails

1. 실패한 step을 먼저 확인합니다.
2. package manager 또는 lockfile 문제면 clean install부터 재현합니다.
3. lint/typecheck/test/build 문제면 해당 workspace로 좁혀 봅니다.
4. native mobile 문제면 web pipeline과 분리해서 봅니다.
