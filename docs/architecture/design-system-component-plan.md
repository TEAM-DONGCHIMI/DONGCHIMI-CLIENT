# Design System Component Plan

이 문서는 동치미 디자인시스템 컴포넌트를 구현하기 전에 Figma 기준 분류, 디자인시스템 승격 기준, 구현 순서를 정리하는 장소입니다.

현재 동치미 Figma component map은 확정되지 않았습니다. Figma section, frame, screenshot이 확정되면 이 문서를 갱신합니다.

## Figma Sources

- 공통 컴포넌트:
- client product components:
- admin product components:
- design-system-web:

## Classification

컴포넌트를 아래 중 하나로 분류합니다.

| 분류 | 의미 | 위치 |
| --- | --- | --- |
| DS primitive | 제품 의미가 없는 기본 UI | `packages/design-system` |
| DS compound primitive | 제품 의미 없이 여러 primitive를 조합 | `packages/design-system` |
| app wrapper | DS primitive에 제품 copy/data/action을 주입 | `apps/{app}` |
| app-only component | 특정 화면이나 제품 흐름에만 사용 | `apps/{app}` |

## Implementation Order

1. Foundation check: package, token, Storybook, generator 준비 여부 확인
2. Low-level primitives: Button, IconButton, TextField, Checkbox 등
3. Feedback and overlay: Toast, Alert, Dialog, Tooltip 등
4. Navigation and page primitives: Tabs, Pagination, PageHeader 등
5. Data and file composition: Table, FileItem 등
6. App wrappers: 제품 copy, API, route, analytics가 들어가는 wrapper

## Spec Requirements

모든 public design-system component는 `templates/component.spec.md` 기준의 spec을 가집니다.

- purpose
- usage
- public API
- props
- states
- behavior
- styling
- accessibility
- verification

## Storybook Requirements

새 public component는 meaningful story를 가져야 합니다.

- Default
- Disabled/Loading/Error 등 지원 상태
- variant/size matrix
- long text 또는 width constraint가 의미 있으면 별도 story

## Verification

```bash
npm run build-storybook --workspace @dongchimi/design-system
npm run lint --workspace @dongchimi/design-system
npm run typecheck --workspace @dongchimi/design-system
git diff --check
```
