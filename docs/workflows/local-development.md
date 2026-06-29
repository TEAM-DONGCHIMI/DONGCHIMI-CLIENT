# Local Development

DONGCHIMI-CLIENT는 pnpm workspace와 Turborepo를 기준으로 로컬 개발과 검증을 실행합니다.

## Runtime

- Node.js: `.node-version`
- pnpm: root `package.json`의 `packageManager`
- workspace: `pnpm-workspace.yaml`
- task runner: `turbo.json`

## Setup

```bash
pnpm install
```

root script는 암묵적 install을 실행하지 않도록 설정되어 있습니다. dependency나 lockfile이 바뀌면 검증 전에 install을 먼저 실행합니다.

CI와 같은 lockfile 검증이 필요하면 아래 명령을 사용합니다.

```bash
pnpm install --frozen-lockfile
```

## Dev Ports

로컬 앱 포트는 모노레포 안에서 고정합니다. 공유 URL, callback URL, CORS, QA 문서가 흔들리지 않도록 자동 port fallback은 사용하지 않습니다.

| Workspace           | Port   | Command                 | Notes                                   |
| ------------------- | ------ | ----------------------- | --------------------------------------- |
| `apps/client`       | `3000` | `pnpm dev:web`          | Next dev script에서 `--port 3000` 명시  |
| `apps/market-owner` | `5173` | `pnpm dev:market-owner` | Vite `strictPort: true`로 fallback 차단 |

E2E도 같은 포트를 사용합니다. 자세한 기준은 [E2E Testing](./e2e-testing.md)을 따릅니다.

## Root Verification

변경 범위가 명확하지 않거나 PR 전 전체 검증이 필요하면 아래 순서로 실행합니다.

```bash
git diff --check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

E2E smoke까지 확인해야 하는 변경이면 아래 명령을 추가로 실행합니다.

```bash
pnpm e2e:smoke
```

성능 예산과 Lighthouse report를 확인해야 하면 전체 build 뒤 아래 명령을 실행합니다.

```bash
pnpm perf
```

자세한 기준은 [Performance Budget](./performance-budget.md)을 따릅니다.

문서 링크와 agent skill 구조를 바꾼 경우:

```bash
rg -n "docs/agent|\\.agents|templates/|recipes/" AGENTS.md README.md docs recipes templates
find .agents/skills -maxdepth 3 -name SKILL.md -print
git diff --check
pnpm format:check
```

## Commit-Time Verification

Husky pre-commit hook은 `pnpm lint-staged`를 실행합니다.
staged 파일은 Prettier로 정리하고, `apps/client` 코드 파일은 ESLint `--fix`를 함께 적용합니다.

pre-commit hook은 빠른 로컬 가드이며, CI와 PR 전 root verification을 대체하지 않습니다.

## Targeted Verification

workspace별 변경은 위치 기준으로 targeted 검증을 우선합니다.

```text
apps/client/** -> client lint/typecheck/test/build
apps/market-owner/** -> market-owner lint/typecheck/test/build
apps/design-system-web/** -> design-system web lint/typecheck/build
apps/admin/** -> admin lint/typecheck/build, 앱이 생성된 뒤 적용
apps/mobile/** -> web check와 별도 mobile command
packages/design-system/** -> design-system lint/typecheck/test/build/storybook
packages/shared/** -> 소비 app build 필요 여부 확인
docs/**, recipes/**, templates/** -> git diff --check + format check
turbo/generators/** -> pnpm check:generators + sample generation
```

## App Scripts

| Workspace           | Dev                     | Targeted verification                                                                                                                            |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apps/client`       | `pnpm dev:web`          | `pnpm --filter client lint`, `pnpm --filter client typecheck`, `pnpm --filter client test`, `pnpm --filter client build`                         |
| `apps/market-owner` | `pnpm dev:market-owner` | `pnpm --filter market-owner lint`, `pnpm --filter market-owner typecheck`, `pnpm --filter market-owner test`, `pnpm --filter market-owner build` |

테스트 종류별 명령과 작성 기준은 [Testing](./testing.md)을 따릅니다.

## E2E Scripts

| Script             | Purpose                            |
| ------------------ | ---------------------------------- |
| `pnpm e2e:install` | Playwright browser dependency 설치 |
| `pnpm e2e:smoke`   | PR용 Chromium smoke 실행           |
| `pnpm e2e`         | 전체 Playwright project 실행       |
| `pnpm e2e:ui`      | 로컬 디버깅 UI 실행                |
| `pnpm e2e:report`  | HTML report 확인                   |

## Deployment

Vercel 프로젝트와 앱별 root directory 기준은 [Deployment](./deployment.md)를 따릅니다.

## Verification Log Rule

최종 요약 또는 PR에는 실제 실행한 명령만 적습니다.
실행하지 못한 검증은 이유와 남은 리스크를 별도 항목으로 남깁니다.
