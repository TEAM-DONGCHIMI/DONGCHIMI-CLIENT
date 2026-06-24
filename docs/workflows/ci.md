# CI

DONGCHIMI-CLIENT의 기본 CI는 GitHub Actions에서 실행합니다.

## Workflow

Workflow file: `.github/workflows/ci.yml`

Trigger:

- `pull_request`
- `push` to `main`
- `push` to `develop`

Runtime:

- Node.js: `.node-version`
- pnpm: root `package.json`의 `packageManager`
- dependency install: `pnpm install --frozen-lockfile`

## Pipeline

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

## Scope

- web build와 native mobile build를 같은 성공 조건으로 보지 않습니다.
- Markdown 파일은 root Prettier 검증 대상입니다.
- Turborepo remote cache 또는 CI cache는 별도 Jira 이슈로 다룹니다.
- secret, token, raw `.env` 값은 CI log에 출력하지 않습니다.
- Vercel Git 연동이 활성화되면 배포는 [Deployment](./deployment.md) 기준을 따릅니다.

## When CI Fails

1. 실패한 step을 먼저 확인합니다.
2. package manager 또는 lockfile 문제면 clean install부터 재현합니다.
3. lint/typecheck/build 문제면 해당 workspace로 좁혀 봅니다.
4. native mobile 문제면 web pipeline과 분리해서 봅니다.
