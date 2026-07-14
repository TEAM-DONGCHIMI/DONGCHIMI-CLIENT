export const getClientEnv = () => {
  return {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, ''),
  };
};
