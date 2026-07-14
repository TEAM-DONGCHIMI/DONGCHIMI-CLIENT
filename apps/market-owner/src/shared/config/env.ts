const getPublicEnv = (key: keyof ImportMetaEnv) => {
  const value = import.meta.env[key]?.trim();

  return value === '' ? undefined : value;
};

const normalizeBaseUrl = (value: string | undefined) => {
  if (value === '/') {
    return value;
  }

  return value?.replace(/\/+$/, '');
};

export const getMarketOwnerEnv = () => {
  return {
    apiBaseUrl: normalizeBaseUrl(getPublicEnv('VITE_PUBLIC_API_SERVER_BASE_URL')),
    devAccessToken: import.meta.env.DEV ? getPublicEnv('VITE_DEV_ACCESS_TOKEN') : undefined,
    enableMsw: import.meta.env.DEV && getPublicEnv('VITE_ENABLE_MSW') === 'true',
    s3BaseUrl: normalizeBaseUrl(getPublicEnv('VITE_PUBLIC_S3_BASE_URL')),
  };
};
