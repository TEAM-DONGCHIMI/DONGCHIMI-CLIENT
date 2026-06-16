# Recipe: Add Hook

Use this when extracting or adding non-trivial state, effect, form, query, mutation, or URL logic.

## Steps

1. logic이 추출할 만큼 복잡한지 확인합니다.
2. `templates/hook.spec.md` 기준으로 spec을 작성 또는 갱신합니다.
3. inputs, return shape, state, actions, side effects를 정의합니다.
4. usage site에서 읽기 쉬운 return shape를 유지합니다.
5. `state`, `action`, `field`, `submission`, `query`처럼 의미 단위로 반환값을 묶습니다.
6. hook 목적이 명확히 소유하지 않으면 navigation, alert, API side effect를 숨기지 않습니다.
7. edge case와 dependency behavior를 검증합니다.

## DONGCHIMI Rules

- Query hooks는 response-changing params를 query key에 포함해야 합니다.
- API errors는 조용히 삼키지 않습니다.
- App-specific hooks는 실제 reuse 전까지 app 내부에 둡니다.
- Shared hooks는 product-specific copy, routes, logging에 의존하지 않습니다.

## Verification

```bash
git diff --check
npm run format:check
npm run lint
npm run typecheck
```
