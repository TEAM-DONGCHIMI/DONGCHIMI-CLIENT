# Decision Logs

이 디렉터리는 DONGCHIMI-CLIENT에서 반복적으로 영향을 주는 구조, 정책, 기술 선택을 기록합니다.

Decision log는 회고나 작업 일지가 아닙니다. 나중에 같은 결정을 다시 검토할 수 있도록 당시의 맥락, 선택지, 결정, 영향 범위, 재검토 조건을 남기는 문서입니다.

## When To Write

아래 중 하나에 해당하면 decision log를 남깁니다.

- app/package 구조, routing, data layer, design-system boundary처럼 여러 작업에 영향을 주는 결정
- package manager, build system, CI, generator, deployment처럼 운영 방식에 영향을 주는 결정
- server/client runtime boundary, auth token handling, cache strategy처럼 되돌리기 어렵거나 장애 영향이 있는 결정
- Jira workflow, PR workflow, agent harness처럼 팀 작업 방식에 영향을 주는 결정
- 대안이 있었고 tradeoff를 설명해야 다음 작업자가 같은 논의를 반복하지 않는 결정

아래는 decision log가 아니라 가까운 spec, PR, Jira에 남깁니다.

- 단일 화면의 copy, spacing, fixture 같은 작은 구현 상세
- 단기 TODO 또는 임시 작업 메모
- 이미 팀 규칙으로 명확한 선택
- 개인 작업 기록이나 진행 상황

## Naming

파일명은 날짜와 짧은 slug를 사용합니다.

```text
YYYY-MM-DD-short-decision-title.md
```

예시:

```text
2026-06-16-agent-harness-layout.md
2026-06-16-jira-rest-access-policy.md
```

## Logs

- [2026-06-29 Design System Jira Project](./2026-06-29-design-system-jira-project.md)

## Template

```markdown
# Decision: {title}

## Status

- Proposed / Accepted / Deprecated / Superseded

## Date

- YYYY-MM-DD

## Context

- 어떤 문제를 해결하려는가?
- 어떤 Jira/spec/Figma/PR/문서가 근거인가?
- 현재 제약은 무엇인가?

## Options

- Option A:
- Option B:
- Option C:

## Decision

- 선택한 안:
- 선택 이유:

## Consequences

- 장점:
- 단점:
- 영향을 받는 파일/문서/작업:

## Verification

- 어떤 검증으로 결정이 유효함을 확인했는가?
- 검증하지 못한 부분은 무엇인가?

## Revisit

- 어떤 조건이 바뀌면 다시 볼 것인가?
- 후속 Jira 또는 TODO:
```

## Rules

- 결정은 현재 확인한 근거만 사용합니다.
- Jira issue가 있으면 `https://dongchimi.atlassian.net/browse/{JIRAKEY}` 링크를 둡니다.
- spec, PR, Figma, screenshot 같은 근거를 가능한 한 링크합니다.
- 결정과 구현 TODO를 섞지 않습니다. 후속 작업은 Jira 또는 PR checklist로 분리합니다.
- 결정이 바뀌면 기존 문서를 덮어쓰기보다 `Status`와 `Superseded by` 링크를 남깁니다.
