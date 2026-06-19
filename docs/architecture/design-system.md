# Design System

`packages/design-system`은 여러 앱에서 공유할 수 있는 제품 비의존 UI 컴포넌트를 관리하는 package입니다.

현재 package는 generator와 public export 경계를 검증하기 위한 최소 골격만 제공합니다. 실제 component 구현은 Figma 공통 컴포넌트 근거 또는 cross-app reuse가 확인된 작업에서 추가합니다.

## Document Map

| 문서                                                              | 역할                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------- |
| [Design System Components](./design-system-components.md)         | 컴포넌트 분류, public API, spec, Storybook, 접근성, 검증 기준 |
| [Design System Component Plan](./design-system-component-plan.md) | 동치미 Figma 기준 공통 컴포넌트 분류와 구현 순서              |
| [Design System Icons](./design-system-icons.md)                   | 아이콘 디렉터리, 생성 명령, SVG 보안 검증, public export 기준 |
| [Styling And Design Tokens](./styling-and-design-tokens.md)       | Tailwind entry, token source, font/color token 기준           |
| [Spec Writing](../workflows/spec-writing.md)                      | public component spec 작성 기준                               |

## Package Role

디자인시스템 패키지가 담당하는 것:

- product-agnostic UI primitive
- product-agnostic layout primitive
- shared component public API
- component accessibility contract
- component spec and Storybook verification surface
- product-agnostic icon component

담당하지 않는 것:

- 동치미 제품 도메인 데이터에 결합된 컴포넌트
- 페이지 섹션, 비즈니스 레이아웃, route-local composition
- API, query, mutation, routing, navigation
- 제품별 copy, logging, analytics, side effect

## Package Structure

```text
packages/design-system/src/
  index.ts
  components/
    index.ts
    ui/
      index.ts
    layout/
      index.ts
  icons/
    index.ts
```

아이콘 source, generated output, Storybook 설정은 아직 연결하지 않습니다.

## Implementation Boundary

공통 Figma에 있더라도 제품 의미가 들어가면 바로 디자인시스템으로 옮기지 않습니다.
디자인시스템에는 외형, 상태, 접근성, slot 구조, public API만 둡니다.
앱에는 route, API, 권한, 제품 copy, 도메인 데이터, submit 동작을 둡니다.
