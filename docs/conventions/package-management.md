# Package Management

현재 DONGCHIMI-CLIENT의 package manager와 build system은 확정되지 않았습니다.

## Current Policy

- `package.json`이 생기기 전에는 npm, pnpm, yarn, Turborepo 중 하나를 문서에서 강제하지 않습니다.
- lockfile이 생기면 해당 package manager를 source of truth로 간주합니다.
- lockfile과 package manager가 충돌하면 구현 전에 정리합니다.

## Package Manager Detection

| File | Package manager |
| --- | --- |
| `package-lock.json` | npm |
| `pnpm-lock.yaml` | pnpm |
| `yarn.lock` | yarn |

## Expected Scripts

프론트엔드 프로젝트가 구성되면 최소한 아래 목적의 script를 둡니다.

```text
format:check
lint
typecheck
build
```

script 이름이 다르면 `docs/workflows/local-development.md`와 `.agents/skills/frontend-quality-verification/SKILL.md`를 함께 갱신합니다.

## Dependency Changes

- dependency 또는 lockfile을 바꾼 PR은 install 검증을 실행합니다.
- package manager가 npm이면 `npm ci`를 사용합니다.
- package manager가 확정되지 않았으면 임의로 lockfile을 만들지 않습니다.
