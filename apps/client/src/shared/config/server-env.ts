const normalizeServerEnv = (value: string | undefined) => value?.trim();

export const getServerEnv = () => {
  return {
    apiBaseUrl: normalizeServerEnv(process.env.API_BASE_URL)?.replace(/\/+$/, ''),
    kakaoRedirectUri: normalizeServerEnv(process.env.KAKAO_REDIRECT_URI),
    kakaoRestApiKey: normalizeServerEnv(process.env.KAKAO_REST_API_KEY),
  };
};
