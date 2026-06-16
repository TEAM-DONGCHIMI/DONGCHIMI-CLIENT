---
name: architecture-review
description: component structure, routing structure, folder structure, workspace boundary를 판단할 때 사용합니다.
---

# Architecture Review

## Purpose

새 app/package 구조, shared boundary, routing boundary, design-system 승격 여부를 판단할 때 사용합니다.

## When To Use

- 새 디렉터리 구조를 만들 때
- app-local 코드와 shared/design-system 코드 중 위치를 결정할 때
- route, API, form, component 책임이 섞일 때
- Jira issue가 여러 package나 app을 동시에 건드릴 때

## Source Of Truth

- `docs/architecture/repo-structure.md`
- `docs/code-quality/index.md`
- `docs/workflows/spec-writing.md`
- 가까운 기존 코드와 spec

## Rules

- app-specific 코드는 owning app 안에 먼저 둡니다.
- 실제 재사용이 생긴 뒤 shared package 또는 design system으로 승격합니다.
- public component API는 spec에 먼저 적습니다.
- route, API, design-system, CI 변경은 가능한 한 별도 Jira/PR로 분리합니다.
- 문서만으로 아직 없는 app/package 구조를 확정하지 않습니다.

## Output

```markdown
## Architecture Review

- 결정:
- 근거:
- 대안:
- 영향 범위:
- 필요한 spec/docs:
- 검증:
```
