# Design System Icons

공통 아이콘은 `packages/design-system`이 생긴 뒤 React 컴포넌트로 생성해 관리합니다.

## Structure

```text
packages/design-system/src/icons/
  svg/        원본 SVG 입력
  generated/ 생성된 TSX 컴포넌트
  index.ts   public icon export
```

아이콘 public API는 `@dongchimi/design-system/icons` subpath 후보에서 명시적으로 export합니다.

## Naming

원본 SVG 파일은 `ic-name.svg` 형식으로 작성하고, 생성된 컴포넌트는 `IcName` 형식을 사용합니다.

```text
src/icons/svg/ic-chevron-down.svg
src/icons/generated/IcChevronDown.tsx
```

## Placement Criteria

디자인시스템 아이콘으로 둘 수 있는 경우:

- 여러 앱에서 같은 의미와 형태로 재사용합니다.
- 제품 copy, route, API, logging, analytics에 의존하지 않습니다.
- Figma design-system asset 또는 제품 비의존 primitive icon입니다.

앱 내부에 둬야 하는 경우:

- 한 앱 또는 한 화면에서만 사용합니다.
- 아이콘 이름, 의미, 노출 조건이 특정 제품 도메인에 묶입니다.
- 서버 응답, 라우팅, 이벤트 로깅 등 제품별 동작과 함께 바뀔 가능성이 큽니다.

## SVG Input Validation

SVGR은 SVG sanitizer가 아닙니다. 아이콘 생성 스크립트는 TSX 변환 전에 원본 SVG를 검증해야 합니다.

차단하는 입력:

- `<script>`, `<foreignObject>`, `<iframe>`, `<object>`, `<embed>`
- `onclick`, `onload` 같은 `on*` 이벤트 속성
- `javascript:` URL
- 외부 `href` 또는 `xlink:href`

`href`와 `xlink:href`는 같은 SVG 내부 symbol이나 gradient를 참조하는 `#id` fragment만 허용합니다.

## Review Checklist

- [ ] The icon belongs in `packages/design-system`.
- [ ] App-specific icon placement was considered.
- [ ] Raw SVG uses `ic-name.svg`.
- [ ] Generated component uses `IcName`.
- [ ] Generated files and exports were reviewed.
- [ ] SVG validation policy is satisfied.
