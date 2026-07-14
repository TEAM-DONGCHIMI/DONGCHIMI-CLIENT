const getPublicEnv = (key: keyof ImportMetaEnv) => {
  const value = import.meta.env[key]?.trim();

  return value === '' ? undefined : value;
};

const normalizeApiBaseUrl = (value: string | undefined) => {
  if (value === '/') {
    return value;
  }

  return value?.replace(/\/+$/, '');
};

export const getMarketOwnerEnv = () => {
  return {
    apiBaseUrl: normalizeApiBaseUrl(getPublicEnv('VITE_PUBLIC_API_SERVER_BASE_URL')),
  };
};
