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

## Root Verification

변경 범위가 명확하지 않거나 PR 전 전체 검증이 필요하면 아래 순서로 실행합니다.

```bash
git diff --check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

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

workspace 구조가 생기면 변경 위치 기준으로 targeted 검증을 우선합니다.

```text
apps/client/** -> client lint/typecheck/build
apps/market-owner/** -> market-owner lint/typecheck/build
apps/design-system-web/** -> design-system web lint/typecheck/build
apps/admin/** -> admin lint/typecheck/build, 앱이 생성된 뒤 적용
apps/mobile/** -> web check와 별도 mobile command
packages/design-system/** -> design-system lint/typecheck/build/storybook
packages/shared/** -> 소비 app build 필요 여부 확인
docs/**, recipes/**, templates/** -> git diff --check + format check
turbo/generators/** -> pnpm check:generators + sample generation
```

## App Scripts

| Workspace           | Dev                     | Targeted verification                                                                                         |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `apps/client`       | `pnpm dev:web`          | `pnpm --filter client lint`, `pnpm --filter client typecheck`, `pnpm --filter client build`                   |
| `apps/market-owner` | `pnpm dev:market-owner` | `pnpm --filter market-owner lint`, `pnpm --filter market-owner typecheck`, `pnpm --filter market-owner build` |

## Deployment

Vercel 프로젝트와 앱별 root directory 기준은 [Deployment](./deployment.md)를 따릅니다.

## Verification Log Rule

최종 요약 또는 PR에는 실제 실행한 명령만 적습니다.
실행하지 못한 검증은 이유와 남은 리스크를 별도 항목으로 남깁니다.
