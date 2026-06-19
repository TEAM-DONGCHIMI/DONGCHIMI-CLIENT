const getPublicEnv = (key: string) => {
  return process.env[key]?.trim();
};

export const getClientEnv = () => {
  return {
    apiBaseUrl: getPublicEnv('NEXT_PUBLIC_API_BASE_URL')?.replace(/\/+$/, ''),
  };
};
