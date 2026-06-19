# Package Management

DONGCHIMI-CLIENT의 package manager는 pnpm입니다.

## Current Policy

- pnpm 버전은 root `package.json`의 `packageManager`를 source of truth로 삼습니다.
- Node.js 버전은 `.node-version`을 source of truth로 삼습니다.
- workspace 범위와 catalog는 `pnpm-workspace.yaml`을 기준으로 합니다.
- lockfile은 `pnpm-lock.yaml`만 사용합니다.
- 다른 package manager lockfile이 생기면 구현 전에 정리합니다.
- script 실행 전 암묵적 install은 `pnpm-workspace.yaml`의 `verifyDepsBeforeRun: false`로 끕니다. dependency 변경 뒤에는 명시적으로 `pnpm install`을 실행합니다.

## Package Manager Detection

| File                | Package manager |
| ------------------- | --------------- |
| `package-lock.json` | npm             |
| `pnpm-lock.yaml`    | pnpm            |
| `yarn.lock`         | yarn            |

## Install

```bash
pnpm install
```

CI와 같은 검증은 frozen lockfile로 실행합니다.

```bash
pnpm install --frozen-lockfile
```

`pnpm-lock.yaml`을 바꾼 PR은 install 검증을 실행합니다.

## Scripts

root `package.json`은 최소한 아래 검증 script를 제공합니다.

```text
format:check
lint
typecheck
build
```

로컬과 CI는 root script를 우선 사용하고, 필요한 경우 `pnpm --filter <workspace> <script>`로 좁힙니다.

## Dependency And Lockfile Changes

- dependency 또는 lockfile을 바꾸면 `pnpm install --frozen-lockfile`을 실행합니다.
- lockfile이 stale하면 dependency 변경 의도를 먼저 확인한 뒤 lockfile을 재생성합니다.
- pnpm active policy가 `minimumReleaseAge`로 새 패키지 버전을 거부하면 설정 오류로 단정하지 않습니다. 최근 발행 패키지를 보류하는 공급망 안전 정책일 수 있습니다.
- `minimumReleaseAge` 위반을 해결할 때는 lockfile 변경을 확인한 뒤, 변경이 의도된 경우 `pnpm clean --lockfile`과 `pnpm install`로 fresh resolution을 만듭니다.
- postinstall build가 필요한 dependency는 `pnpm approve-builds`로 승인하고, 승인 결과를 `pnpm-workspace.yaml`에 남깁니다.
