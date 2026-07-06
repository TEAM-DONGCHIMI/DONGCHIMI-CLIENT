# Recipe: Add Icon

Use this when adding a product-agnostic icon to `packages/design-system`.

Detailed rules:

- `docs/architecture/design-system.md`
- `docs/architecture/design-system-icons.md`

## Flow

1. icon이 design system에 속하는지 확인합니다.
   - multiple apps에서 공유되거나 foundational design-system asset
   - product-agnostic name and meaning
   - no route, API data, product copy, logging, or analytics dependency
2. app-specific icon은 owning app 안에 둡니다.
3. raw SVG export는 staging directory에 둡니다.
4. `ic-name.svg` naming convention을 사용합니다.
5. Figma/export 이름이 다르면 name map으로 `ic-name.svg`에 매핑합니다.
6. dry-run import로 imported / skipped / invalid 결과를 확인합니다.
7. 실제 import를 실행해 신규 SVG만 `packages/design-system/src/icons/svg`에 추가합니다.
8. `--generate`로 icon generator까지 실행하거나, 이어서 `icons:generate`를 실행합니다.
9. generated TSX와 public export diff를 검토합니다.
10. icon과 package verification을 실행합니다.

## Naming

Raw SVG files use `ic-name.svg`.
Generated React components use `IcName`.

Examples:

```text
packages/design-system/src/icons/svg/ic-chevron-down.svg
packages/design-system/src/icons/generated/IcChevronDown.tsx
```

## Import

외부 SVG export 결과는 바로 source directory에 복사하지 않습니다.

```bash
pnpm --filter @dongchimi/design-system icons:import ./tmp/icons --dry-run
pnpm --filter @dongchimi/design-system icons:import ./tmp/icons --generate
```

대량 import에서는 report와 name map을 남깁니다.

```bash
pnpm --filter @dongchimi/design-system icons:import ./tmp/icons \
  --dry-run \
  --name-map ./tmp/icon-name-map.json \
  --report ./tmp/icon-import-report.json
```

Name map은 export 파일명 또는 staging directory 기준 상대 경로를 `ic-name.svg` 파일명으로 매핑합니다.

```json
{
  "Close.svg": "ic-close.svg",
  "Navigation/Arrow Right.svg": "ic-arrow-right.svg"
}
```

`icons:import` 결과:

- `imported`: 신규 source SVG로 추가됩니다.
- `skipped`: 기존 icon source와 중복되어 추가하지 않습니다.
- `invalid`: SVG policy 또는 naming rule을 통과하지 못해 import를 중단합니다.

대량 import나 리뷰 공유가 필요하면 `--report <path>`로 JSON report를 남깁니다.

SVG fingerprint와 shape signature는 SVGO 정규화 뒤 계산합니다. Figma export의 wrapper, attribute order, path data 표현 차이, black/currentColor 차이 때문에 같은 아이콘이 다르게 보이는 false negative를 줄이기 위한 단계입니다.

## SVG Input Policy

SVGR is not a sanitizer. The generator validates raw SVG input before TSX transformation.

Blocked input:

- `<script>`, `<foreignObject>`, `<iframe>`, `<object>`, `<embed>`
- `on*` event attributes such as `onclick` and `onload`
- `javascript:` URLs
- external `href` or `xlink:href` values

## Verification

```bash
pnpm --filter @dongchimi/design-system icons:import ./tmp/icons --dry-run
pnpm --filter @dongchimi/design-system icons:generate
pnpm --filter @dongchimi/design-system check:icons
pnpm --filter @dongchimi/design-system test:unit
pnpm --filter @dongchimi/design-system lint
pnpm --filter @dongchimi/design-system typecheck
pnpm --filter @dongchimi/design-system build
git diff --check
```

package script나 design-system workspace가 없으면 실행하지 못한 이유를 기록합니다.
