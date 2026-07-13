const getServerEnvValue = (key: string) => {
  return process.env[key]?.trim();
};

export const getServerApiEnv = () => {
  return {
    apiBaseUrl: getServerEnvValue('API_BASE_URL')?.replace(/\/+$/, ''),
    developmentAccessToken:
      process.env.NODE_ENV === 'development' ? getServerEnvValue('DEV_ACCESS_TOKEN') : undefined,
  };
};
