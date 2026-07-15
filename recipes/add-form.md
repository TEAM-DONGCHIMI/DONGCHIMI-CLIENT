# Recipe: Add Form

Use this when adding a form, validation flow, multi-step input flow, or submit interaction.

Quality rule:

- `docs/code-quality/frontend-fundamentals.md`
- `docs/code-quality/frontend-readability.md`, `docs/code-quality/frontend-predictability.md`, `docs/code-quality/frontend-cohesion.md`, `docs/code-quality/frontend-coupling.md`
- `docs/code-quality/frontend-logic-composition.md`

## Steps

1. form owner를 정의합니다.
   - page-level form
   - route-local component
   - shared component
2. 가장 가까운 spec을 작성 또는 갱신합니다.
   - Page-owned form: `templates/page.spec.md`
   - Component-owned form: `templates/component.spec.md`
   - Extracted form logic hook: `templates/hook.spec.md`
3. fields, validation rules, error messages를 나열합니다.
4. submit disabled conditions와 error message visibility conditions를 분리합니다.
5. errors가 언제 나타나는지 결정합니다.
   - touched
   - dirty
   - submitted
   - server response
6. submit behavior를 정의합니다.
   - request data
   - mutation hook
   - success handling
   - failure handling
   - navigation or toast side effects
7. validation message로 layout shift가 생기지 않게 합니다.
8. keyboard interaction, labels, focus-visible, disabled states를 확인합니다.
9. Frontend Fundamentals 허브, 개별 기준 문서, logic composition 기준으로 field/form 응집도, side effect 위치, hook return shape, 예측 가능성을 self-check합니다.
10. 검증을 실행합니다.

## State Boundary

fields가 하나의 business action으로 제출되거나 cross-field validation이 중요하면 form-level cohesion을 선택합니다.
fields가 독립 validation, async validation, reuse needs를 가지면 field-level cohesion을 검토합니다.

컴포넌트가 길다는 이유만으로 form hook을 추출하지 않습니다. validation, submit, mutation, navigation logic 때문에 UI가 읽기 어려울 때 추출합니다.

## Verification

```bash
git diff --check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```
