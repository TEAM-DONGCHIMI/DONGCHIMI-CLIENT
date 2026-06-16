# Recipe: Refactor Component

Use this when changing existing component structure without adding new behavior.

## Steps

1. Define the current responsibility of the component.
2. Identify the actual problem before changing code.
3. Classify the change.
   - Must: bug or performance risk
   - Should: maintainability
   - Could: style or preference
4. Avoid splitting only because the file is long.
5. Split when responsibilities, state, or change reasons are different.
6. Keep unrelated formatting and behavior unchanged.
7. Remove only unused code created by the refactor.
8. Run verification commands and compare behavior.

## Guardrails

- Do not move code to `packages/*` without real cross-app reuse.
- Keep route-local code route-local.
- Prefer local duplication when a shared abstraction would bind product policies together.
- Update the nearest spec if the responsibility or public API changes.

## Verification

```bash
git diff --check
npm run format:check
npm run lint
npm run typecheck
npm run build
```
