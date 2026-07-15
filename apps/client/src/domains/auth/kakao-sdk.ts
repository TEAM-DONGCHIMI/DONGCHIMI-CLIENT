interface KakaoSdkTypes {
  Auth: {
    authorize: (options: { redirectUri: string }) => void;
  };
  init: (javaScriptKey: string) => void;
  isInitialized: () => boolean;
}

declare global {
  interface Window {
    Kakao?: KakaoSdkTypes;
  }
}

export const getKakaoSdk = () => window.Kakao;
