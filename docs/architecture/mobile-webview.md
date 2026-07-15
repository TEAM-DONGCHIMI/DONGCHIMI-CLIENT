# Mobile WebView

`apps/mobile`은 필요할 때 WebView 구성을 위한 React Native 앱으로 추가합니다.

## Scope

- React Native native shell을 관리합니다.
- 웹 앱 기능 구현과 native 앱 검증을 같은 성공 조건으로 보지 않습니다.
- Android/iOS 네이티브 환경 의존성은 별도로 확인합니다.

## Commands

앱이 생성되면 실제 script 이름으로 갱신합니다.

```bash
pnpm mobile:start
pnpm mobile:android
pnpm mobile:ios
```

## Verification Rule

- web build 성공은 native mobile 성공을 의미하지 않습니다.
- native 변경이 있으면 Android/iOS command 결과를 별도로 기록합니다.
