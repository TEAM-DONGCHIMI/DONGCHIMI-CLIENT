# Frontend Fundamentals

이 문서는 Toss Frontend Fundamentals의 코드 품질 원칙을 DONGCHIMI-CLIENT에서 구현 self-check와 리뷰에 사용하는 repo-local 기준의 허브입니다.

원문과 플러그인:

- Frontend Fundamentals: https://frontend-fundamentals.com/code-quality/code/
- Claude Code plugin: https://github.com/toss/frontend-fundamentals/tree/main/frontend-fundamentals-plugin
- Codex skill: `.agents/skills/frontend-fundamentals-review/SKILL.md`

원문의 자세한 사례와 최신 설명은 위 링크를 기준으로 확인합니다. 이 문서는 Codex가 repo 안에서 일관되게 읽을 수 있도록 실전 가이드의 핵심 판단 기준을 repo-local 문서로 나눈 adapter입니다.

## 참조 방식

Codex skill은 리뷰할 때 사이트를 자동으로 열거나 fetch하지 않습니다.
`$frontend-fundamentals-review`는 이 로컬 허브와 아래 개별 기준 문서를 먼저 읽고, 사이트 링크는 기준의 출처와 최신 원문 확인용으로만 사용합니다.

사이트의 실전 가이드가 바뀌면 이 문서와 개별 기준 문서를 함께 갱신해야 skill의 구현 및 리뷰 기준도 바뀝니다.

## 개별 기준

- [Readability](./frontend-readability.md): 코드가 적은 맥락으로 위에서 아래로 읽히는지 확인합니다.
- [Predictability](./frontend-predictability.md): 이름, 인자, 반환 타입, DOM 의미만 보고 동작을 예측할 수 있는지 확인합니다.
- [Cohesion](./frontend-cohesion.md): 함께 수정되는 코드가 함께 있는지 확인합니다.
- [Coupling](./frontend-coupling.md): 변경 영향 범위가 작고 예측 가능한지 확인합니다.
- [Logic Composition](./frontend-logic-composition.md): 컴포넌트 내부 로직, custom hook 추출, orchestration hook, 공통 hook 승격 기준을 확인합니다.

## 적용 방식

- 페이지, 컴포넌트, hook/state, API query/mutation, form flow 구현 중에는 관련 기준 문서를 구현 self-check 기준으로 사용합니다.
- 구현 도중 한 기준만 집중해서 확인해야 하면 `$frontend-readability-check`, `$frontend-predictability-check`, `$frontend-cohesion-check`, `$frontend-coupling-check` 중 해당 skill을 사용합니다.
- 컴포넌트 내부 로직이나 custom hook 추출 단위를 판단해야 하면 `$frontend-logic-composition-workflow`를 사용합니다.
- 비자명한 변경, shared/public API 변경, PR 전 품질 점검, 코드 리뷰 요청 시 `$frontend-fundamentals-review`가 네 기준을 통합해서 확인합니다.
- 브라우저 PR 리뷰에서 FE 코드 diff가 있으면 `browser-pr-review-workflow`로 PR 상태와 기존 review thread를 먼저 분리한 뒤 이 기준을 적용합니다.
- 단순 copy, import 정리, formatting-only 변경은 formatter와 정적 검증으로 충분하면 이 기준을 별도 리뷰 단계로 강제하지 않습니다.
- lint, typecheck, build를 대체하지 않습니다.
- finding은 파일/라인 근거가 있을 때만 작성합니다.
- CodeRabbit 또는 기존 reviewer thread가 이미 같은 문제를 다뤘다면 중복 코멘트를 만들지 않습니다.
- 기준 밖 취향 문제나 아직 없는 요구사항은 finding으로 만들지 않습니다.

## 기준별 사용 예

- Readability: 구현 중 조건부 렌더링, 중첩 삼항, JSX 내부 절차형 로직, 복잡한 boolean 조건을 정리할 때 사용합니다.
- Predictability: hook return shape, API helper 반환 타입, 숨은 side effect, UI semantics와 public API가 맞는지 확인할 때 사용합니다.
- Cohesion: feature-local component, hook, type, fixture, spec, form validation, magic number 배치를 정할 때 사용합니다.
- Coupling: hook 책임 분리, props drilling, shared/design-system 승격, 중복 허용 여부를 판단할 때 사용합니다.
- Logic Composition: component 내부 로직을 남길지, 순수 함수/단일 책임 hook/orchestration hook/common hook으로 나눌지 판단할 때 사용합니다.

## Tradeoff

네 기준은 항상 동시에 극대화되지 않습니다.

- 응집도를 높이려고 공통화하면 가독성이 떨어질 수 있습니다.
- 중복을 허용하면 결합도는 낮아질 수 있지만 응집도가 떨어질 수 있습니다.
- 추상화는 변경 누락을 줄일 수 있지만 호출부 이해 비용을 늘릴 수 있습니다.

리뷰와 구현에서는 "이번 Jira scope에서 어떤 기준이 유지보수 리스크를 가장 크게 줄이는가"를 먼저 판단합니다. 한 기준만 적용해 결론을 내리지 말고, tradeoff가 보이면 통합 `$frontend-fundamentals-review` 기준으로 다시 확인합니다.

## Output Severity

- Critical: 실제 버그, API 계약 위반, 숨은 부수 효과, 리뷰/검증을 막는 구조
- Warning: 가까운 시점에 유지보수 비용을 키울 가능성이 높은 구조
- Suggestion: 지금 고치면 읽기 쉬워지지만 PR을 막지는 않는 개선
