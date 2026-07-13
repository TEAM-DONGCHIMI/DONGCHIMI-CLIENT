const normalizePublicEnv = (value: string | undefined) => value?.trim();

export const getClientEnv = () => {
  return {
    apiBaseUrl: normalizePublicEnv(process.env.NEXT_PUBLIC_API_BASE_URL)?.replace(/\/+$/, ''),
    kakaoJavaScriptKey: normalizePublicEnv(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY),
    kakaoRedirectUri: normalizePublicEnv(process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI),
  };
};
