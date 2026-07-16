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

기본 CI는 변경 범위를 감지한 뒤 repository hygiene와 영향받은 앱·패키지 검증을 분리합니다.

| Job                       | Responsibility                                                               |
| ------------------------- | ---------------------------------------------------------------------------- |
| `Detect affected targets` | base/head diff에서 검증할 `packages`, `client`, `market-owner`를 계산합니다. |
| `Repository hygiene`      | 모든 변경에서 formatting과 design-system icon drift를 검증합니다.            |
| `Packages`                | 영향받은 package의 lint, typecheck, test, build를 검증합니다.                |
| `Client web`              | client web의 lint, typecheck, test, build를 검증합니다.                      |
| `Market owner web`        | market-owner web의 lint, typecheck, test, build를 검증합니다.                |
| `Verify`                  | 실행 또는 skip된 job 결과를 집계하는 고정 required check입니다.              |

`Repository hygiene`는 항상 실행하고, 영향받은 `Packages`, `Client web`, `Market owner web`은 서로 다른 runner에서 병렬 실행합니다. 각 runner는 dependency를 독립적으로 설치합니다.

Repository hygiene:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm check:icons
```

Packages:

```bash
pnpm install --frozen-lockfile
pnpm turbo run lint typecheck test --only \
  --filter=@dongchimi/design-system \
  --filter=@dongchimi/shared \
  --filter=@dongchimi/eslint-config \
  --filter=@dongchimi/typescript-config
pnpm turbo run build --only \
  --filter=@dongchimi/design-system \
  --filter=@dongchimi/shared \
  --filter=@dongchimi/eslint-config \
  --filter=@dongchimi/typescript-config
```

Client web:

```bash
pnpm install --frozen-lockfile
pnpm turbo run lint typecheck test --only --filter=client
pnpm turbo run build --only --filter=client
```

Market owner web:

```bash
pnpm install --frozen-lockfile
pnpm turbo run lint typecheck test --only --filter=market-owner
pnpm turbo run build --only --filter=market-owner
```

`--only`는 각 target job에서 다른 workspace의 상위 task를 중복 실행하지 않게 합니다. lint, typecheck, test는 함께 실행하고, build는 Next.js 생성물과 typecheck의 경쟁을 피하기 위해 다음 step에서 실행합니다. package 변경은 앱 job을 명시적으로 함께 활성화해 소비 앱 회귀를 검증합니다.

| Changed surface                      | Packages | Client | Market owner |
| ------------------------------------ | -------- | ------ | ------------ |
| `apps/client/**`                     | Skip     | Run    | Skip         |
| `apps/market-owner/**`               | Skip     | Skip   | Run          |
| `packages/**`                        | Run      | Run    | Run          |
| root 설정, lockfile, CI workflow 등  | Run      | Run    | Run          |
| docs, recipes, templates, Markdown만 | Skip     | Skip   | Skip         |

## Required Check

Branch protection은 기존과 같은 `CI / Verify`를 required check로 사용합니다. `Verify`는 항상 실행되며 변경 감지와 repository hygiene가 성공했는지, 각 target job이 변경 범위에 따라 성공 또는 skip됐는지 검증합니다.

같은 PR 또는 branch에서 새 commit이 push되면 이전 CI run은 `concurrency.cancel-in-progress`로 취소합니다.

## Metrics

GitHub 저장소의 `Insights` -> `Actions Performance Metrics`에서 기간과 workflow를 선택해 average run time, average queue time, failure rate를 확인합니다. workflow별 병목을 비교할 때는 `CI`로 필터링하고 `Workflows`와 `Jobs` 탭을 함께 봅니다.

개별 실행의 job과 step 소요 시간은 `Actions` -> `CI` -> workflow run summary에서 확인합니다.

- [Viewing GitHub Actions metrics](https://docs.github.com/en/actions/how-tos/administer/view-metrics)
- [Viewing workflow run history](https://docs.github.com/en/actions/how-tos/monitor-workflows/view-workflow-run-history)

Full local verification:

```bash
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
- job 분리는 wall-clock time 단축을 위한 구조이며, 각 runner의 dependency install은 독립적으로 실행됩니다.
- secret, token, raw `.env` 값은 CI log에 출력하지 않습니다.
- Vercel Git 연동이 활성화되면 배포는 [Deployment](./deployment.md) 기준을 따릅니다.

## When CI Fails

1. `CI / Verify`에서 실패한 child job을 확인합니다.
2. package manager 또는 lockfile 문제면 clean install부터 재현합니다.
3. lint/typecheck/test/build 문제면 해당 workspace로 좁혀 봅니다.
4. native mobile 문제면 web pipeline과 분리해서 봅니다.
