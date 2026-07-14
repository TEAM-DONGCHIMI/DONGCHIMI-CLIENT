const getPublicEnv = (key: keyof ImportMetaEnv) => {
  const value = import.meta.env[key]?.trim();

  return value === '' ? undefined : value;
};

export const getMarketOwnerEnv = () => {
  return {
    apiBaseUrl: getPublicEnv('VITE_PUBLIC_API_SERVER_BASE_URL')?.replace(/\/+$/, ''),
    devAccessToken: import.meta.env.DEV ? getPublicEnv('VITE_DEV_ACCESS_TOKEN') : undefined,
    enableMsw: import.meta.env.DEV && getPublicEnv('VITE_ENABLE_MSW') === 'true',
  };
};
