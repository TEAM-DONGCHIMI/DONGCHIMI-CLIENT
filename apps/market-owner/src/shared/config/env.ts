const normalizePublicEnv = (value: string | undefined) => {
  const normalizedValue = value?.trim();

  return normalizedValue === '' ? undefined : normalizedValue;
};

const normalizeBaseUrl = (value: string | undefined) => {
  const normalizedValue = normalizePublicEnv(value);

  if (normalizedValue === '/') {
    return normalizedValue;
  }

  return normalizedValue?.replace(/\/+$/, '');
};

export const getMarketOwnerEnv = () => {
  return {
    apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_PUBLIC_API_SERVER_BASE_URL),
    clientBaseUrl: normalizePublicEnv(import.meta.env.VITE_PUBLIC_CLIENT_BASE_URL)?.replace(
      /\/+$/,
      '',
    ),
    kakaoMapAppKey: normalizePublicEnv(import.meta.env.VITE_PUBLIC_KAKAO_MAP_APP_KEY),
    s3BaseUrl: normalizeBaseUrl(import.meta.env.VITE_PUBLIC_S3_BASE_URL),
  };
};
