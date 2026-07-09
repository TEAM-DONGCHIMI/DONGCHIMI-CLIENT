# Recipe: Refactor Component

Use this when changing existing component structure without adding new behavior.

Quality rule:

- `docs/code-quality/frontend-fundamentals.md`
- `docs/code-quality/frontend-readability.md`, `docs/code-quality/frontend-predictability.md`, `docs/code-quality/frontend-cohesion.md`, `docs/code-quality/frontend-coupling.md`
- `docs/code-quality/frontend-logic-composition.md`

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
8. Frontend Fundamentals 허브, 개별 기준 문서, logic composition 기준으로 refactor가 가독성, 예측 가능성, 응집도, 결합도를 실제로 개선하는지 확인합니다.
9. Run verification commands and compare behavior.

## Guardrails

- Do not move code to `packages/*` without real cross-app reuse.
- Keep route-local code route-local.
- Prefer local duplication when a shared abstraction would bind product policies together.
- Update the nearest spec if the responsibility or public API changes.

## Verification

```bash
git diff --check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```
