# DONGCHIMI-CLIENT Docs

이 디렉터리는 동치미 클라이언트의 구조, 컨벤션, 작업 절차, agent harness를 분리해서 관리합니다.
`README.md`는 빠른 진입점으로 유지하고, 세부 규칙은 이 문서들을 기준으로 갱신합니다.

## Architecture

- [Repo Structure](./architecture/repo-structure.md)
- [App Structure](./architecture/app-structure.md)
- [Market Owner App](./architecture/market-owner-app.md)
- [Data Layer](./architecture/data-layer.md)
- [Design System](./architecture/design-system.md)
- [Design System Components](./architecture/design-system-components.md)
- [Design System Component Plan](./architecture/design-system-component-plan.md)
- [Design System Icons](./architecture/design-system-icons.md)
- [Styling And Design Tokens](./architecture/styling-and-design-tokens.md)
- [Mobile WebView](./architecture/mobile-webview.md)

## Conventions

- [Code Quality](./code-quality/index.md)
- [Frontend Fundamentals](./code-quality/frontend-fundamentals.md)
- [Git](./conventions/git.md)
- [Coding](./conventions/coding.md)
- [Package Management](./conventions/package-management.md)

## Workflows

- [Local Development](./workflows/local-development.md)
- [CI](./workflows/ci.md)
- [Deployment](./workflows/deployment.md)
- [Jira Issue Authoring](./workflows/jira-issue-authoring.md)
- [Spec Writing](./workflows/spec-writing.md)
- [Turbo Generators](./workflows/turbo-generators.md)
- [PR Checklist](./workflows/pr-checklist.md)
- [Pull Request Writing](./workflows/pull-request-writing.md)
- [Pull Request Template](../.github/pull_request_template.md)

## Decisions

- [Decision Log Guide](./decisions/index.md)

## Agent Harness

- [Agent Harness](./agent/index.md)
- [Agent Indexing](./agent/indexing.md)
- [Agent Config](./agent/config.md)
- [Agent Hooks](./agent/hooks.md)
- [Serena MCP](./agent/serena-mcp.md)
- [Agent Guide](../AGENTS.md)
- [Jira Design Implementation Workflow](../.agents/skills/jira-design-implementation-workflow/SKILL.md)
- [App Shared Component Workflow](../.agents/skills/app-shared-component-workflow/SKILL.md)
- [Frontend Task Orchestrator](../.agents/skills/frontend-task-orchestrator/SKILL.md)
- [Frontend Quality Verification](../.agents/skills/frontend-quality-verification/SKILL.md)
- [Frontend Fundamentals Review](../.agents/skills/frontend-fundamentals-review/SKILL.md)
- [Commit Planning Workflow](../.agents/skills/commit-planning-workflow/SKILL.md)
- [Turbo Generator Workflow](../.agents/skills/turbo-generator-workflow/SKILL.md)
- [Design System Component Workflow](../.agents/skills/design-system-component-workflow/SKILL.md)
- [Page Feature Workflow](../.agents/skills/page-feature-workflow/SKILL.md)
- [API Integration Workflow](../.agents/skills/api-integration-workflow/SKILL.md)
- [Form Flow Workflow](../.agents/skills/form-flow-workflow/SKILL.md)
- [Performance Diagnosis](../.agents/skills/performance-diagnosis/SKILL.md)
- [Sequential Thinking](../.agents/skills/sequential-thinking/SKILL.md)
- [Refactor Evaluator](../.agents/skills/refactor-evaluator/SKILL.md)
- [Architecture Review](../.agents/skills/architecture-review/SKILL.md)
- [Manage Skills](../.agents/skills/manage-skills/SKILL.md)
- [Verify Implementation](../.agents/skills/verify-implementation/SKILL.md)
- [Verify Agent Docs](../.agents/skills/verify-agent-docs/SKILL.md)

## Recipes

- [Repo Orientation](../recipes/repo-orientation.md)
- [Jira 디자인 기반 구현](../recipes/jira-design-to-implementation.md)
- [Add Page](../recipes/add-page.md)
- [Add Component](../recipes/add-component.md)
- [Add App Shared Component](../recipes/add-app-shared-component.md)
- [Add Design System Component](../recipes/add-design-system-component.md)
- [Add Icon](../recipes/add-icon.md)
- [Add Hook](../recipes/add-hook.md)
- [Add API Query](../recipes/add-api-query.md)
- [Add Form](../recipes/add-form.md)
- [Refactor Component](../recipes/refactor-component.md)
- [Frontend Fundamentals Review](../recipes/frontend-fundamentals-review.md)
- [PR Prep](../recipes/pr-prep.md)
- [Commit Plan](../recipes/commit-plan.md)

## Templates

- [Jira Issue Template](../templates/jira-issue-template.md)
- [Page Spec Template](../templates/page.spec.md)
- [Component Spec Template](../templates/component.spec.md)
- [Hook Spec Template](../templates/hook.spec.md)

## Maintenance Rule

- 새 규칙은 먼저 가장 가까운 세부 문서에 추가합니다.
- README에는 프로젝트 소개, 빠른 시작, 주요 문서 링크만 유지합니다.
- Codex나 다른 agent의 실행 지침은 루트 `AGENTS.md`에 둡니다.
- 사고 프레임은 `.agents/skills/*/SKILL.md`에 둡니다.
- 반복 작업 절차는 `recipes/*.md`에 둡니다.
- 구현 전 요구사항 정리는 `templates/*.spec.md` 형식을 따릅니다.
