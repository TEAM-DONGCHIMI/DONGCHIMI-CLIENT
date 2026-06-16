# CI

CI는 package manager, app workspace, build scripts가 생긴 뒤 확정합니다.

## Planned Pipeline

```bash
install
format:check
lint
typecheck
build
```

실제 package manager가 npm이면 `install`은 `npm ci`입니다. pnpm이면 `pnpm install --frozen-lockfile`처럼 해당 도구 기준으로 바꿉니다.

## Scope

- web build와 native mobile build를 같은 성공 조건으로 보지 않습니다.
- Markdown 파일이 formatter 대상인지 package script가 생긴 뒤 확인합니다.
- Turborepo remote cache 또는 CI cache는 별도 Jira 이슈로 다룹니다.
- secret, token, raw `.env` 값은 CI log에 출력하지 않습니다.

## When CI Fails

1. 실패한 step을 먼저 확인합니다.
2. package manager 또는 lockfile 문제면 clean install부터 재현합니다.
3. lint/typecheck/build 문제면 해당 workspace로 좁혀 봅니다.
4. native mobile 문제면 web pipeline과 분리해서 봅니다.
