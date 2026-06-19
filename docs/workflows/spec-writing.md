# Spec Writing

Spec은 구현 전에 행동, 상태, 책임 범위를 짧게 고정하기 위한 문서입니다. 모든 변경에 강제하지 않고, 구현 중 해석이 흔들릴 수 있는 작업에 사용합니다.

## Location

가능하면 spec은 설명하는 코드 가까이에 둡니다.

```text
apps/client/src/app/reservation/page.spec.md
apps/client/src/domains/home/index/HomePage.spec.md
apps/client/src/domains/reservation/list/components/ReservationCard.spec.md
apps/client/src/domains/reservation/hooks/use-reservation-query.spec.md
apps/client/src/domains/reservation/model/reservation-types.spec.md
packages/design-system/src/components/Button/Button.spec.md
```

여러 앱에 걸친 정책, 제품 공통 플로우, 또는 구현 위치가 아직 정해지지 않은 초기 설계는 `docs/` 하위에 둡니다.

```text
docs/specs/reservation-flow.md
docs/specs/design-system-token-policy.md
```

실제 app/package 구조가 다르면 이 예시는 구조 확정 시 갱신합니다.

## Required

Spec을 작성하거나 갱신해야 하는 경우:

- 새 page 또는 route를 추가할 때
- 새 form 또는 단계형 state flow를 추가할 때
- 새 API query 또는 mutation을 추가할 때
- shared component 또는 design-system component를 추가할 때
- UI state가 loading, empty, error, disabled 등 여러 상태로 나뉘는 component를 추가할 때
- public props, hook return shape, route params, API contract가 바뀔 때
- 구현 중 요구사항이 바뀌어 기존 spec과 달라졌을 때

## Optional

Spec 생략이 가능한 경우:

- copy만 수정할 때
- 단순 spacing, color, typo 같은 작은 style 조정
- import path 또는 파일명 정리
- 타입명 변경처럼 동작이 바뀌지 않는 정리
- 테스트, 문서, 주석만 수정하는 경우
- 기존 spec의 요구사항을 그대로 만족하는 작은 내부 구현 변경

## Template Selection

- Page or route: `templates/page.spec.md`
- Component: `templates/component.spec.md`
- Hook, query, mutation, state logic: `templates/hook.spec.md`

## Depth Rule

- PR 리뷰어가 구현 의도를 이해할 수 있을 정도로만 씁니다.
- 불확실한 요구사항, 상태, 에러 처리, 접근성, 검증 방법은 생략하지 않습니다.
- 이미 코드나 디자인에서 명확한 내용은 짧게 링크하거나 한 줄로 정리합니다.
- spec을 구현보다 더 복잡하게 만들지 않습니다.

## Public API Section

Component spec에는 `Public API` 섹션을 둡니다.

- public package component는 호출 예시, export되는 component/type, 호출부 책임과 non-owned behavior를 적습니다.
- route-local component는 외부 package export가 없다는 점과 page/hook이 주입하는 책임을 적습니다.
- public props, hook return shape, route params, API contract가 바뀌면 이 섹션도 함께 갱신합니다.
- 단순 문서/테스트 변경처럼 API 표면이 없으면 생략 사유를 PR에 적습니다.

## Review Checklist

- spec 위치가 코드와 충분히 가까운가?
- component spec에 Public API 섹션이 있는가?
- 요구사항, 상태, 에러 처리, 접근성, 검증 방법이 적혀 있는가?
- 구현이 spec과 달라졌다면 spec도 함께 갱신했는가?
- spec을 생략했다면 생략 이유가 PR에서 설명 가능한가?
