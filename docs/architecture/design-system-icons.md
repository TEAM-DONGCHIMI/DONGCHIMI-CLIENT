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

## Import Pipeline

외부 툴에서 export한 SVG는 바로 `src/icons/svg`에 복사하지 않고 staging directory에 둔 뒤 import script를 실행합니다.

```bash
pnpm --filter @dongchimi/design-system icons:import ./tmp/icons --dry-run
pnpm --filter @dongchimi/design-system icons:import ./tmp/icons --generate
```

대량 import에서는 report와 name map을 함께 사용할 수 있습니다.

```bash
pnpm --filter @dongchimi/design-system icons:import ./tmp/icons \
  --dry-run \
  --name-map ./tmp/icon-name-map.json \
  --report ./tmp/icon-import-report.json
```

`icons:import`는 신규 source SVG만 `src/icons/svg`에 추가합니다. Generated component와 public export 갱신은 `icons:generate`가 담당합니다.
`--generate`를 함께 사용하면 import 성공 뒤 generator까지 이어서 실행합니다. `--generate`를 생략하면 import 로그가 다음에 실행할 `icons:generate` 명령을 안내합니다.

대량 import나 리뷰 공유가 필요하면 `--report <path>`로 JSON report를 남깁니다.

자동 skip 기준:

- 같은 `ic-name.svg` 파일명이 이미 있습니다.
- 같은 `IcName` component name이 이미 있습니다.
- SVG fingerprint 또는 shape signature가 기존 icon source와 같습니다.

SVG fingerprint와 shape signature는 SVGO 정규화를 거친 입력을 기준으로 계산합니다. 이 정규화는 Figma export의 wrapper, attribute order, path data 표현, black/currentColor 차이로 인한 false negative를 줄이기 위한 import 전 단계입니다.

`check:icons`는 SVG 입력 정책뿐 아니라 source SVG 목록과 `generated/`, `index.ts` 동기 상태도 확인합니다. `icons:generate`는 생성 시점 source SVG의 fingerprint를 `generated/icons.manifest.json`에 기록하고, `check:icons`는 현재 SVG fingerprint를 manifest와 대조해 **SVG 내용이 바뀌었는데 재생성하지 않은 경우**(파일명만으로는 못 잡는 drift)까지 감지합니다.

## Generated Color Contract

공통 단색 아이콘은 소비자가 CSS `color`로 색을 제어할 수 있어야 합니다.

- source 또는 SVGR 결과의 neutral black fill/stroke는 generated TSX에서 `currentColor`로 정규화합니다.
- `none`, white, product color, semantic color처럼 의도적인 비중립 색상은 보존합니다.
- `var(--fill-0, #000)` 또는 `var(--stroke-0, #000)`처럼 Figma export에서 나온 neutral fallback도 `currentColor`로 정규화합니다.
- currentColor 정규화 변경은 `packages/design-system/scripts/icon-utils.test.mjs`와 `check:icons`로 검증합니다.

root `pnpm check:icons`는 design-system workspace의 `check:icons`를 실행하며 CI에서도 같은 명령으로 source/generated/export drift를 막습니다.

## Review Checklist

- [ ] The icon belongs in `packages/design-system`.
- [ ] App-specific icon placement was considered.
- [ ] Raw SVG uses `ic-name.svg`.
- [ ] Generated component uses `IcName`.
- [ ] Generated files and exports were reviewed.
- [ ] SVG validation policy is satisfied.
- [ ] `check:icons` verified source/generated/index sync.
