---
name: refactor-evaluator
description: refactor, component split, state removal, hook optimization, maintainability, complexity reduction 여부를 판단할 때 사용합니다.
---

# Refactor Evaluator

Use this skill before refactoring existing code. Evaluate necessity before changing code.

## Required Output

1. Current Responsibility
2. Smell Detection
   - readability
   - predictability
   - cohesion
   - coupling
   - unnecessary state
   - re-render triggers
   - side effects
   - hot paths
3. Improvement Classification
   - Must: bug or performance risk
   - Should: maintainability
   - Could: style or preference
4. Refactor Options
5. Recommended Refactor
6. Regression Risk And Test Points

## Rules

- Follow `AGENTS.md`.
- Apply `docs/code-quality/index.md`.
- Apply `docs/code-quality/frontend-fundamentals.md` when evaluating React component, hook, API, form, or page structure.
- Avoid unnecessary splitting.
- Do not refactor unrelated code.
- Prefer local duplication over premature shared abstraction.
- Justify every recommendation.
- Define success criteria and verification steps before implementation.
- Keep the refactor scope surgical.

## DONGCHIMI Checks

- Is the code only long, or does it actually mix responsibilities?
- Should the code stay page-local, app-shared, or package-shared?
- Does extraction improve usage-site readability?
- Does the refactor change route, query, form, or API behavior?
- Which commands or manual checks prove behavior stayed the same?
