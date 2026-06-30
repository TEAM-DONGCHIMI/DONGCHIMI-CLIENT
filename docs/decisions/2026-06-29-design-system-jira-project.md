# Decision: 디자인 시스템 Jira project 통합

## Status

- Accepted

## Date

- 2026-06-29

## Context

- 디자인 시스템 package는 `packages/design-system`, 문서/검증 웹은 예정 app인 `apps/design-system-web`에서 다룹니다.
- 초기 문서에는 package와 design-system-web을 별도 Jira project key로 분리하는 안이 남아 있었습니다.
- Jira workspace는 `DCMDS`가 생성되었고, design-system-web은 독립 제품보다 디자인 시스템의 문서화, 검증, 쇼케이스 surface에 가깝습니다.

## Options

- Option A: package와 design-system-web을 별도 Jira project key로 분리합니다.
- Option B: package와 design-system-web을 모두 `DCMDS-*`에서 관리하고 Jira Component 또는 label로 surface를 구분합니다.

## Decision

- 선택한 안: Option B
- 선택 이유: design-system-web은 디자인 시스템 package와 변경 흐름, 검증, 릴리즈 판단이 강하게 묶입니다. 별도 project key를 두면 이슈 링크, 보드, PR 제목 규칙, 자동화가 불필요하게 복잡해질 수 있습니다.

## Consequences

- `packages/design-system`과 `apps/design-system-web` 변경은 모두 `DCMDS-*` Jira key를 사용합니다.
- 필요한 경우 Jira Component 또는 label로 `package`, `design-system-web`, `storybook`, `tokens`, `icons` 같은 surface를 구분합니다.
- design-system-web 전용 별도 Jira project key는 현재 문서와 workflow 기준에서 사용하지 않습니다.

## Verification

- `AGENTS.md`, README, Jira 작성 기준, Git convention, Jira template, generator workflow, repo structure 문서의 key mapping을 `DCMDS-*` 기준으로 갱신합니다.

## Revisit

- design-system-web이 독립 제품처럼 별도 릴리즈, 권한, 보드, 운영 책임을 갖게 되면 Jira project 분리를 다시 검토합니다.
