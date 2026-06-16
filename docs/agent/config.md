# Agent Config

이 문서는 DONGCHIMI-CLIENT에서 Codex config를 어디에 둘지 정의합니다.

## Default Policy

Repo에는 기본적으로 `.codex/config.toml`을 두지 않습니다.

개인 선호나 로컬 성능 설정은 사용자 전역 config에 둡니다.

```text
~/.codex/config.toml
```

Serena MCP도 같은 원칙을 따릅니다. Codex MCP server 등록은 개인 `~/.codex/config.toml`에 두고, repo에는 팀 공용 project 설정인 `.serena/project.yml`과 운영 문서만 둡니다. 자세한 기준은 [Serena MCP](./serena-mcp.md)를 따릅니다.

Jira REST 접근을 위한 email, API token, site URL은 repo에 커밋하지 않습니다. 로컬에서는 `.env.local` 또는 repo 밖 개인 파일을 사용합니다.

```text
ATLASSIAN_SITE_URL=https://dongchimi.atlassian.net
ATLASSIAN_EMAIL=
ATLASSIAN_API_TOKEN=
```

`.env`, `.env.local`, `.env.*`는 `.gitignore`에 포함되어 있어야 합니다. 예시가 필요하면 secret 값 없이 `.env.example`만 둡니다.

## When To Add Repo Config

다음 조건 중 하나가 있을 때만 repo-local config를 검토합니다.

- 모든 팀원이 같은 Codex feature flag를 사용해야 합니다.
- repo-local MCP server나 sandbox 정책이 필요합니다.
- project instruction fallback filename처럼 repo 문서 탐색 동작을 공통으로 바꿔야 합니다.
- hook을 repo-local로 도입해야 하고 config inline 방식이 더 명확합니다.

이 경우 위치는 다음 중 하나를 사용합니다.

```text
.codex/config.toml
.codex/hooks.json
```

## Responsibility Split

| Setting type | Location | Rule |
| --- | --- | --- |
| model preference | `~/.codex/config.toml` | 개인 설정 |
| context window | `~/.codex/config.toml` | 개인 설정 |
| approval/sandbox preference | `~/.codex/config.toml` | 개인 설정, 팀 합의 전 repo 금지 |
| Jira REST token | `.env.local` 또는 repo 밖 개인 env file | 개인 secret, repo 금지 |
| Codex hook policy | `~/.codex/hooks.json` 또는 개인 Codex config | 개인 자동화, repo 금지 |
| shared hook policy | `.codex/hooks.json` | 팀 정책이 있을 때만 |
| shared fallback filenames | `.codex/config.toml` | repo 문서 구조가 요구할 때만 |
| Serena MCP client entry | `~/.codex/config.toml` | 개인 설정, repo에는 등록하지 않음 |
| Serena project policy | `.serena/project.yml` | 팀 공용 semantic navigation 설정 |

## Git Identity Guard

개인 장비에서 Codex가 이 repo의 commit 또는 push 명령을 실행할 때는 로컬 정책(예: Codex hook 또는 사용자별 git hook)으로 본인 계정 기준을 강제할 수 있습니다.

이 정책은 협업자에게 전파되지 않도록 해야 하므로 repo의 `.githooks/` 또는 `core.hooksPath`로 관리하지 않습니다.
개인 Codex hook 설정은 `~/.codex/hooks.json` 또는 사용자 전역 Codex config에 둡니다.

팀 전체에 적용해야 하는 hook은 별도 합의 후 `.codex/hooks.json`에 추가하고, PR에서 영향 범위와 trust 요구사항을 명시합니다.

## Verification

config를 추가하거나 바꾼 뒤 확인할 것:

```bash
codex debug prompt-input "config smoke test" >/tmp/codex-config-smoke.json
```

repo-local config를 추가했다면 PR 설명에 팀 공통 정책으로 둔 이유를 적습니다.
