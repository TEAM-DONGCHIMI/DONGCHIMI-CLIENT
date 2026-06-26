const getPublicEnv = (key: keyof ImportMetaEnv) => {
  return import.meta.env[key]?.trim();
};

export const getMarketOwnerEnv = () => {
  return {
    apiBaseUrl: getPublicEnv('VITE_API_BASE_URL')?.replace(/\/+$/, ''),
  };
};
