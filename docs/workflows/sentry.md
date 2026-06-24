# Sentry Workflow

이 문서는 `apps/client`와 `apps/market-owner`에 적용한 Sentry 설정의 목적, 파일 위치, 로컬 검증 방법, 배포 후속 작업을 정리합니다.

## Purpose

Sentry는 프론트엔드 런타임에서 발생하는 예외를 수집하고, 어떤 앱과 환경에서 문제가 발생했는지 추적하기 위한 에러 모니터링 도구입니다.

동치미 클라이언트는 사용자 앱과 사장님 앱이 분리되어 있으므로 앱별 SDK 설정을 각 app 내부에 둡니다. 실제 에러 알림은 Sentry 프로젝트에서 Alert Rule과 Discord 알림 액션을 연결해 처리합니다.

## Dependency Policy

Sentry SDK는 workspace catalog를 기준으로 관리합니다.

```yaml
catalog:
  '@sentry/nextjs': ^10.59.0
  '@sentry/react': ^10.59.0
```

앱 package에는 직접 버전을 쓰지 않고 `catalog:`를 사용합니다.

```json
{
  "dependencies": {
    "@sentry/nextjs": "catalog:"
  }
}
```

```json
{
  "dependencies": {
    "@sentry/react": "catalog:"
  }
}
```

## File Map

```text
apps/
  client/
    next.config.mjs                         # withSentryConfig로 Next build 설정 연결
    src/
      instrumentation-client.ts             # 브라우저 런타임 Sentry 초기화
      instrumentation.ts                    # Next server/edge instrumentation 등록
      sentry.server.config.ts               # Node.js server runtime Sentry 초기화
      sentry.edge.config.ts                 # Edge runtime Sentry 초기화
      app/
        global-error.tsx                    # App Router 전역 에러 fallback에서 예외 전송

  market-owner/
    src/
      main.tsx                              # React root 생성 시 Sentry error handler 연결
      shared/config/sentry.ts               # Vite React 앱 Sentry 초기화
    vite-env.d.ts                           # VITE_SENTRY_* env 타입 선언

.env.example                                # Sentry env key 문서화
pnpm-workspace.yaml                         # Sentry SDK catalog 등록
```

## Next.js Client App

`apps/client`는 Next.js App Router 앱이므로 `@sentry/nextjs`를 사용합니다.

브라우저 런타임은 `instrumentation-client.ts`에서 초기화합니다.

```ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? 'local',
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
});
```

Next App Router navigation 추적을 위해 아래 export를 유지합니다.

```ts
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
```

서버와 엣지 런타임은 `instrumentation.ts`에서 분기합니다.

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
```

App Router 전역 에러 fallback에서는 `captureException`으로 예외를 명시적으로 전송합니다.

```ts
Sentry.captureException(error);
```

`next.config.mjs`는 기존 Next 설정을 유지한 뒤 `withSentryConfig`로 감쌉니다. source map 업로드는 `SENTRY_AUTH_TOKEN`이 있을 때만 활성화합니다.

## Vite React Market Owner App

`apps/market-owner`는 Vite React 앱이므로 `@sentry/react`를 사용합니다.

Sentry 초기화는 앱 내부 config에 둡니다.

```ts
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE;
const SENTRY_RELEASE = import.meta.env.VITE_SENTRY_RELEASE;
```

DSN이 없으면 로컬 실행이나 테스트 환경에서 Sentry 초기화를 건너뜁니다.

```ts
export function initSentry() {
  if (!SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    release: SENTRY_RELEASE,
  });
}
```

React root 생성 시 SDK의 root error handler를 연결합니다.

```ts
createRoot(rootElement, getSentryReactRootOptions()).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## Next.js And React Differences

Sentry API 자체는 두 앱에서 거의 같습니다. 예외를 직접 전송할 때는 각각의 SDK에서 `captureException`을 사용합니다.

```ts
// Next.js
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error);
```

```ts
// Vite React
import * as Sentry from '@sentry/react';

Sentry.captureException(error);
```

차이는 초기화 위치와 환경변수 접근 방식입니다.

| 구분            | `apps/client`                                                            | `apps/market-owner`         |
| --------------- | ------------------------------------------------------------------------ | --------------------------- |
| Framework       | Next.js App Router                                                       | Vite React                  |
| SDK             | `@sentry/nextjs`                                                         | `@sentry/react`             |
| Env access      | `process.env.NEXT_PUBLIC_*`                                              | `import.meta.env.VITE_*`    |
| Browser init    | `instrumentation-client.ts`                                              | `shared/config/sentry.ts`   |
| Server init     | `instrumentation.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` | 해당 없음                   |
| Global fallback | `app/global-error.tsx`                                                   | React root error handler    |
| Source map      | `withSentryConfig` 기반 준비                                             | 배포 workflow에서 후속 검토 |

## Environment And Release

Sentry 프로젝트와 DSN은 앱별로 두고, 같은 앱 안의 환경 구분은 `environment` 태그로 처리합니다.

로컬에서는 아래 값을 사용합니다.

```env
# apps/client
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ENVIRONMENT=local
NEXT_PUBLIC_SENTRY_RELEASE=local

# apps/market-owner
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=local
VITE_SENTRY_RELEASE=local
```

preview / production 값은 배포 환경에서 주입합니다.

```env
# preview
NEXT_PUBLIC_SENTRY_ENVIRONMENT=preview
VITE_SENTRY_ENVIRONMENT=preview

# production
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
VITE_SENTRY_ENVIRONMENT=production
```

release는 배포 commit을 기준으로 넣는 것을 권장합니다.

```env
NEXT_PUBLIC_SENTRY_RELEASE=<git-commit-sha>
VITE_SENTRY_RELEASE=<git-commit-sha>
```

Vercel 배포를 사용하면 `VERCEL_GIT_COMMIT_SHA`, GitHub Actions 배포를 사용하면 `GITHUB_SHA`를 release 값으로 연결하는 방식을 검토합니다.

## Local Verification

로컬에서 확인할 때는 각 app의 local env에 DSN을 넣고 dev server를 실행합니다.

```bash
pnpm dev:web
pnpm dev:market-owner
```

브라우저에서 버튼 클릭이나 임시 테스트 코드로 에러를 발생시킨 뒤 Sentry Issues에서 이벤트가 생성되는지 확인합니다.

```ts
throw new Error('Sentry test error');
```

처리된 에러를 직접 보내려면 `captureException`을 사용합니다.

```ts
Sentry.captureException(new Error('Sentry captured test error'));
```

임시 테스트 route나 테스트 버튼은 검증 후 제거합니다. 테스트 코드와 `throw new Error(...)`는 제품 코드에 남기지 않습니다.

## Source Map Follow-Up

source map 업로드는 배포 workflow가 확정된 뒤 마무리합니다.

필요한 값은 아래와 같습니다.

```env
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

주의할 점:

- `SENTRY_AUTH_TOKEN`은 절대 `NEXT_PUBLIC_` 또는 `VITE_` prefix를 붙이지 않습니다.
- 실제 token, Discord webhook URL, 기타 secret 값은 Git에 커밋하지 않습니다.
- `.env.example`에는 key 이름만 남깁니다.
- GitHub Actions 또는 Vercel 배포 설정에서 source map upload와 release 값을 함께 연결합니다.
