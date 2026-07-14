const normalizePublicEnv = (value: string | undefined) => {
  const normalizedValue = value?.trim();

  return normalizedValue === '' ? undefined : normalizedValue;
};

export const getMarketOwnerEnv = () => {
  return {
    apiBaseUrl: normalizePublicEnv(import.meta.env.VITE_PUBLIC_API_SERVER_BASE_URL)?.replace(
      /\/+$/,
      '',
    ),
    kakaoMapAppKey: normalizePublicEnv(import.meta.env.VITE_PUBLIC_KAKAO_MAP_APP_KEY),
  };
};
