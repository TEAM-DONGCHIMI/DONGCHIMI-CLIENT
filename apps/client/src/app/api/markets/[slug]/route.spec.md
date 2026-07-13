# Route Handler Spec: `GET /api/markets/[slug]`

## Metadata

- Jira: DCMCL-18
- App: `client`
- Status: Implemented

## Purpose

브라우저에 access token을 노출하지 않고 마트 상세 upstream API를 호출하는 BFF Route Handler입니다.

## Contract

- browser endpoint: `GET /api/markets/{slug}`
- upstream endpoint: `GET /v1/users/markets/{slug}`
- request: path parameter `slug`
- response: upstream status와 JSON body를 그대로 전달하며, cache는 `no-store`입니다.

## Server Environment

- `API_BASE_URL`: upstream API의 base URL
- `DEV_ACCESS_TOKEN`: development에서만 upstream `Authorization: Bearer ...` header로 사용합니다.
- 두 값은 `apps/client/.env.local`에만 두며 `NEXT_PUBLIC_` prefix를 사용하지 않습니다.
- production에서는 `DEV_ACCESS_TOKEN`을 무시합니다.

## Error Handling

- `API_BASE_URL`이 없으면 `500` configuration response를 반환합니다.
- upstream network failure는 `502` response를 반환합니다.
- upstream이 JSON이 아닌 응답을 반환하면 `502` response를 반환합니다.
- upstream HTTP error는 status/body를 그대로 browser에 전달합니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client test`
- [ ] `pnpm --filter client build`
- [ ] development token forwarding and production omission coverage
