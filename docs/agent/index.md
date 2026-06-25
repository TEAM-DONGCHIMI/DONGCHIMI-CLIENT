# Agent Harness

이 디렉터리는 DONGCHIMI-CLIENT에서 Codex와 다른 coding agent가 읽는 문서, skill, config, hook의 역할을 정리합니다.

## Documents

- [Indexing](./indexing.md): `AGENTS.md`, `.agents/skills`, `docs`, `recipes`, `templates`의 인덱싱 기준입니다.
- [Config](./config.md): 전역 Codex 설정과 repo-local 설정의 책임 범위입니다.
- [Hooks](./hooks.md): repo-local hook 도입 기준과 안전 원칙입니다.
- [Serena MCP](./serena-mcp.md): Serena MCP의 팀 공용 설정과 운영 기준입니다.

## Current Shape

```text
AGENTS.md
.agents/
  skills/
    api-integration-workflow/SKILL.md
    app-shared-component-workflow/SKILL.md
    jira-design-implementation-workflow/SKILL.md
    frontend-task-orchestrator/SKILL.md
    frontend-quality-verification/SKILL.md
    frontend-fundamentals-review/SKILL.md
    commit-planning-workflow/SKILL.md
    turbo-generator-workflow/SKILL.md
    design-system-component-workflow/SKILL.md
    page-feature-workflow/SKILL.md
    form-flow-workflow/SKILL.md
    performance-diagnosis/SKILL.md
    refactor-evaluator/SKILL.md
    sequential-thinking/SKILL.md
    architecture-review/SKILL.md
    manage-skills/SKILL.md
    verify-implementation/SKILL.md
    verify-agent-docs/SKILL.md
    verify-<name>/SKILL.md
docs/
recipes/
templates/
```

## Maintenance Rule

- `AGENTS.md`는 agent가 어디를 먼저 읽을지 알려주는 짧은 허브로 유지합니다.
- 상세 규칙은 `docs/`, `recipes/`, `templates/`, `.agents/skills/`의 가장 가까운 source of truth에 둡니다.
- 실행 지침은 가장 가까운 `AGENTS.md`에 두되, 다른 문서 내용을 길게 복사하지 않습니다.
- 재사용 가능한 사고 프레임은 `.agents/skills/*/SKILL.md`에 둡니다.
- Jira/Figma/사진 근거 확인과 구현 착수 순서는 `jira-design-implementation-workflow`에 둡니다.
- 앱 내부 shared 컴포넌트 생성과 구현 순서는 `app-shared-component-workflow`에 둡니다.
- Turbo generator script, template, sample 검증 순서는 `turbo-generator-workflow`에 둡니다.
- 프론트엔드 workflow와 검증 범위 선택은 `frontend-*` 및 `*-workflow` skill에 둡니다.
- Toss Frontend Fundamentals 기반 코드 품질 리뷰는 `frontend-fundamentals-review`에 둡니다.
- 커밋 분해와 stage/commit 계획은 `commit-planning-workflow`에 둡니다.
- verify skill도 `.agents/skills/verify-<name>/SKILL.md`에 직접 둡니다. 현재 기본 verify skill은 `verify-agent-docs`입니다.
- 구조, 정책, 작업 절차는 `docs/`, `recipes/`, `templates/`로 분리합니다.
- Sentry 설정과 알림 운영 기준은 `docs/workflows/sentry.md`에 둡니다.
- 개인 선호 설정은 repo에 커밋하지 않고 사용자 전역 Codex config에 둡니다.
- repo-local config와 hook은 팀 공통 정책이 필요할 때만 추가합니다.
- Serena MCP는 repo-local `.serena/project.yml`과 사용자별 MCP 설정을 분리합니다.

## Official References

- [AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [Skills](https://developers.openai.com/codex/skills)
- [Config basics](https://developers.openai.com/codex/config-basic)
- [Hooks](https://developers.openai.com/codex/hooks)
