---
name: frontend-fundamentals-review
description: Toss Frontend Fundamentals의 가독성, 예측 가능성, 응집도, 결합도 기준으로 프론트엔드 diff 또는 지정 파일을 리뷰할 때 사용합니다.
---

# Frontend Fundamentals Review

## 목적

프론트엔드 변경사항을 Toss Frontend Fundamentals의 코드 품질 기준으로 리뷰합니다.

이 skill은 Claude Code용 `frontend-fundamentals-plugin`을 Codex repo-local skill로 옮긴 것입니다. Claude의 `/frontend-fundamentals:review` 명령은 Codex에서 `$frontend-fundamentals-review` 호출로 대체합니다.

원문:

- Frontend Fundamentals: https://frontend-fundamentals.com/code-quality/code/
- Claude Code plugin: https://github.com/toss/frontend-fundamentals/tree/main/frontend-fundamentals-plugin

주의: 이 skill은 리뷰 중 원격 사이트를 자동으로 읽지 않습니다. 상세 실전 가이드 기준은 repo-local `docs/code-quality/frontend-fundamentals.md`를 source of truth로 사용합니다.

## 입력 점검

- 리뷰 대상: 현재 diff, 특정 파일, 특정 PR 범위 중 하나
- 기준 branch: 지정이 없으면 현재 branch의 diff
- 요청 모드: review only 또는 finding 수정까지 수행
- 브라우저 PR 리뷰에서 호출된 경우: PR 번호, head branch, 기존 review thread/CodeRabbit에서 이미 커버된 finding

리뷰 대상이 없으면 먼저 현재 변경 범위를 확인합니다.

```bash
git status --short
git diff --name-only
```

## 읽기 전략

항상 읽습니다.

- `docs/code-quality/index.md`
- `docs/code-quality/frontend-fundamentals.md`
- 리뷰 대상 파일 또는 현재 diff

필요하면 읽습니다.

- 가까운 spec 또는 story
- 가까운 hook, API helper, component, fixture
- `docs/workflows/spec-writing.md`
- `docs/architecture/repo-structure.md`
- 브라우저 PR 리뷰에서는 `.agents/skills/browser-pr-review-workflow/SKILL.md`

큰 파일 전체를 읽기보다 변경 hunk와 직접 의존 코드부터 봅니다.

## 리뷰 기준

상세 기준은 `docs/code-quality/frontend-fundamentals.md`를 source of truth로 사용합니다.

- Readability: 코드가 적은 맥락으로 읽히는가
- Predictability: 이름, 인자, 반환 타입만 보고 동작을 예측할 수 있는가
- Cohesion: 함께 수정되는 코드가 함께 있는가
- Coupling: 변경 영향 범위가 작고 예측 가능한가

디자인시스템 또는 shared UI diff에서는 아래 semantics도 네 기준 안에서 확인합니다.

- ARIA role은 컴포넌트가 해당 keyboard/focus behavior를 실제로 소유할 때만 붙입니다.
- checkbox, toggle, menu, listbox, link/action semantics가 public API와 DOM behavior에서 어긋나지 않아야 합니다.
- 새 React 19 기준 컴포넌트는 React 18 호환 요구가 없으면 `forwardRef`보다 `ref` prop 패턴을 우선 검토합니다.
- Storybook/Figma wrapper 상태와 component defect를 분리합니다.

React component diff에서는 아래 anti-pattern도 확인합니다.

- else가 `null`인 단순 조건부 렌더링, 중첩 삼항, JSX 내부 IIFE/switch/중첩 return
- 렌더 중 side effect, derived state 동기화 effect, 무의미한 props-state 복사
- 조건부 hook 호출, unstable key, 이유 없는 `useMemo`/`useCallback`

## 메인 작업 흐름

1. 리뷰 범위를 확정합니다.
2. 변경 hunk와 직접 의존 코드를 확인합니다.
3. 기존 CodeRabbit/reviewer thread가 있으면 이미 커버된 finding을 제외합니다.
4. 네 기준을 모두 적용하되 기준 밖 취향 문제는 제외합니다.
5. finding은 파일과 라인 근거가 있을 때만 작성합니다.
6. severity를 나눕니다.
7. 사용자가 수정을 요청한 경우 finding 단위로 수정하고 재검토합니다.

## Severity

- Critical: 실제 버그, API 계약 위반, 숨은 부수 효과, 리뷰/검증을 막는 구조
- Warning: 가까운 시점에 유지보수 비용을 키울 가능성이 높은 구조
- Suggestion: 지금 고치면 읽기 쉬워지지만 PR을 막지는 않는 개선

## 출력 형식

```markdown
## Frontend Fundamentals Review

### Critical

- 없음

### Warnings

- **Readability** `path/to/file.tsx:L10` - 문제
  - Fix: 제안

### Suggestions

- 없음

Residual risk:
- 확인하지 못한 범위와 이유
```

finding이 없으면 명확히 "발견된 품질 이슈 없음"이라고 말합니다.

## 완료 기준

- 네 기준을 모두 확인했습니다.
- findings는 파일/라인 근거가 있습니다.
- 기존 review thread와 중복되는 comment는 제외했습니다.
- lint/typecheck/build 결과와 code quality 판단을 분리했습니다.
- 기준 밖 취향, 스타일 선호, 아직 없는 요구사항은 finding으로 만들지 않았습니다.

## 예외

- 단순 문서 변경에는 사용하지 않습니다.
- formatting-only 변경은 formatter 검증으로 충분하면 생략합니다.
- 사용자가 특정 기준만 요청하면 해당 기준을 우선하되, 심각한 다른 기준 위반은 별도로 표시합니다.
