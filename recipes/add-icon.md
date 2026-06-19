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
3. raw SVG를 `packages/design-system/src/icons/svg`에 추가합니다.
4. `ic-name.svg` naming convention을 사용합니다.
5. icon generator를 실행합니다.
6. generated TSX와 public export diff를 검토합니다.
7. icon과 package verification을 실행합니다.

## Naming

Raw SVG files use `ic-name.svg`.
Generated React components use `IcName`.

Examples:

```text
packages/design-system/src/icons/svg/ic-chevron-down.svg
packages/design-system/src/icons/generated/IcChevronDown.tsx
```

## SVG Input Policy

SVGR is not a sanitizer. The generator validates raw SVG input before TSX transformation.

Blocked input:

- `<script>`, `<foreignObject>`, `<iframe>`, `<object>`, `<embed>`
- `on*` event attributes such as `onclick` and `onload`
- `javascript:` URLs
- external `href` or `xlink:href` values

## Verification

```bash
pnpm --filter @dongchimi/design-system check:icons
pnpm --filter @dongchimi/design-system lint
pnpm --filter @dongchimi/design-system typecheck
pnpm --filter @dongchimi/design-system build
git diff --check
```

package script나 design-system workspace가 없으면 실행하지 못한 이유를 기록합니다.
