const getPublicEnv = (key: keyof ImportMetaEnv) => {
  const value = import.meta.env[key]?.trim();

  return value === '' ? undefined : value;
};

export const getMarketOwnerEnv = () => {
  return {
    apiBaseUrl: getPublicEnv('VITE_PUBLIC_API_SERVER_BASE_URL')?.replace(/\/+$/, ''),
    clientBaseUrl: getPublicEnv('VITE_PUBLIC_CLIENT_BASE_URL')?.replace(/\/+$/, ''),
  };
};
