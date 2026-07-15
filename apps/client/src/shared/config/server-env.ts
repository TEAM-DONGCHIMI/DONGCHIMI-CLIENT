const normalizeServerEnv = (value: string | undefined) => value?.trim();

export const getServerEnv = () => {
  return {
    apiBaseUrl: normalizeServerEnv(process.env.API_BASE_URL)?.replace(/\/+$/, ''),
  };
};
