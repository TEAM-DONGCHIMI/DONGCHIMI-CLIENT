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
    clientBaseUrl: getPublicEnv('VITE_PUBLIC_CLIENT_BASE_URL')?.replace(/\/+$/, ''),
    s3BaseUrl: normalizeBaseUrl(getPublicEnv('VITE_PUBLIC_S3_BASE_URL')),
  };
};
