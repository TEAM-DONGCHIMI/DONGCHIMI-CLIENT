# Design System Package Agent Guide

이 경로에서는 root `AGENTS.md`를 먼저 따르고, `packages/design-system` 전용 규칙만 추가로 적용합니다.

## 저장소 정체

- Jira key: `DCMDS-*`
- Workspace: `packages/design-system`
- Package name: `@dongchimi/design-system`
- Package role: product-agnostic UI, layout, icon, style contract

## 먼저 볼 문서

- [Design System](../../docs/architecture/design-system.md)
- [Design System Components](../../docs/architecture/design-system-components.md)
- [Design System Component Plan](../../docs/architecture/design-system-component-plan.md)
- [Design System Icons](../../docs/architecture/design-system-icons.md)
- [Styling And Design Tokens](../../docs/architecture/styling-and-design-tokens.md)
- [Add Design System Component Recipe](../../recipes/add-design-system-component.md)
- [Design System Component Workflow](../../.agents/skills/design-system-component-workflow/SKILL.md)
- [Verify Design System Styles](../../.agents/skills/verify-design-system-styles/SKILL.md)
- [Verify Design System Icons](../../.agents/skills/verify-design-system-icons/SKILL.md)

## 로컬 원칙

- app, route, domain, API, query, mutation, logging, analytics에 의존하지 않습니다.
- 제품 copy나 제품 데이터 shape가 필요한 컴포넌트는 앱 내부에 둡니다.
- public component는 `components/ui` 또는 `components/layout` 아래에 둡니다.
- public style helper는 `styles` 아래에 두고 `@dongchimi/design-system/styles` subpath에서 명시적으로 export합니다.
- icon source는 `src/icons/svg`, generated output은 `src/icons/generated` 기준을 따릅니다.
- public export는 명시적으로 작성하고 `export *`를 사용하지 않습니다.
- public component의 `ComponentNameProps`는 기본적으로 함께 export합니다.
- internal helper, private constant, recipe detail은 public entry에서 노출하지 않습니다.
- vanilla-extract style authoring은 package-local `.css.ts`에 둡니다.
- token 또는 CSS variable이 확정되기 전에는 product palette나 semantic token을 임의로 만들지 않습니다.

## Component Checklist

- `pnpm gen:ds-component`로 scaffold를 생성합니다.
- component 가까이에 `ComponentName.spec.md`를 둡니다.
- Storybook story에는 `Default`와 의미 있는 state, variant, 긴 텍스트/overflow 사례를 포함합니다.
- 접근성 계약은 spec과 story에서 확인 가능하게 남깁니다.
- public props 또는 interaction이 바뀌면 spec과 story를 함께 갱신합니다.
- layout primitive는 제품 맥락 없는 배치 책임만 가집니다.
- app-specific 요구를 package public API로 바로 끌어올리지 않습니다.

## 검증

```bash
pnpm --filter @dongchimi/design-system lint
pnpm --filter @dongchimi/design-system typecheck
pnpm --filter @dongchimi/design-system test
pnpm --filter @dongchimi/design-system build
pnpm --filter @dongchimi/design-system build-storybook
```

아이콘 source 또는 generated output을 바꾸면 아래 검증을 추가합니다.

```bash
pnpm --filter @dongchimi/design-system check:icons
pnpm --filter @dongchimi/design-system icons:generate
```
