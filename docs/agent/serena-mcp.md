# Serena MCP

이 문서는 DONGCHIMI-CLIENT에서 Serena MCP를 팀 공용으로 다루는 범위와 운영 기준을 정리합니다.

## 결론

Serena MCP는 제한적 팀 공용 도입으로 둡니다.

- repo에는 `.serena/project.yml`만 커밋합니다.
- Codex MCP server 등록은 각 개발자의 `~/.codex/config.toml`에 둡니다.
- 기본 사용 목적은 semantic navigation, symbol/reference 탐색, diagnostics입니다.
- repo 기본값은 `read_only: true`입니다. 파일 수정은 기존 `apply_patch`, repo workflow, 검증 명령이 계속 책임집니다.
- Serena memory는 repo 문서, Jira, Figma, spec의 대체 source of truth로 쓰지 않습니다.

## 설치

Serena는 repo dependency로 추가하지 않습니다. 각 개발자 로컬 도구로 설치합니다.

```bash
uv tool install -p 3.13 serena-agent
serena init
serena setup codex
```

`serena setup codex`를 쓰지 않고 직접 설정할 경우 `~/.codex/config.toml`에 MCP server 설정을 추가합니다.

## DONGCHIMI-CLIENT Project Config

repo-local 설정은 `.serena/project.yml`에 둡니다.

현재 설정 원칙:

- `project_name: "DONGCHIMI-CLIENT"`: Serena activation에서 사용할 이름입니다.
- `languages: ["typescript"]`: 클라이언트 코드가 생기면 TypeScript 탐색을 우선합니다.
- `ignore_all_files_in_gitignore: true`: `node_modules`, `dist`, cache 등은 `.gitignore` 기준으로 제외합니다.
- `read_only: true`: Serena의 편집 도구는 repo 기본값에서 비활성화합니다.

프로젝트가 TypeScript가 아닌 스택으로 확정되면 `languages`를 실제 코드 기준으로 갱신합니다.

## 사용 권장

Serena를 먼저 고려할 작업:

- 컴포넌트, hook, type, utility의 symbol overview 확인
- 특정 symbol의 reference 탐색
- rename/refactor 전 영향 범위 조사
- TypeScript/React 변경 후 diagnostics 확인

기존 도구를 계속 우선할 작업:

- 단순 문자열 검색: `rg`
- 파일 일부 읽기: `sed`, `nl`
- 실제 파일 수정: `apply_patch`
- 검증: package script 또는 `docs/workflows/local-development.md` 기준 명령
- Jira/Figma/spec 판단: Jira, Figma, `docs/`, `recipes/`, `.agents/skills/`

## 보안 기준

- MCP server는 stdio 또는 localhost 연결만 사용합니다.
- Serena Dashboard와 MCP HTTP/SSE endpoint를 외부 네트워크에 노출하지 않습니다.
- `.serena/project.yml` 외의 `.serena/*` runtime data는 커밋하지 않습니다.
- 민감 정보가 들어갈 수 있는 Serena memory는 팀 source of truth로 쓰지 않고, 필요한 결정은 Jira 또는 repo 문서에 기록합니다.

## 운영 체크리스트

설치 확인:

```bash
uv --version
serena --help
serena --version
```

Codex MCP 등록 확인:

```bash
codex mcp get serena
```

프로젝트 설정 확인:

```bash
serena project health-check .
```

문서 변경 검증:

```bash
git diff --check
```

## 참고

- Serena GitHub: https://github.com/oraios/serena
- Serena Documentation: https://oraios.github.io/serena/
