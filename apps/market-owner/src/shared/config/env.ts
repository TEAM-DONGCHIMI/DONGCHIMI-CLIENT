const getPublicEnv = (key: keyof ImportMetaEnv) => {
  const value = import.meta.env[key]?.trim();

  return value === '' ? undefined : value;
};

export const getMarketOwnerEnv = () => {
  return {
    apiBaseUrl: getPublicEnv('VITE_API_BASE_URL')?.replace(/\/+$/, ''),
    temporaryExcelUploadBaseUrl: getPublicEnv('VITE_TEMPORARY_EXCEL_UPLOAD_BASE_URL')?.replace(
      /\/+$/,
      '',
    ),
  };
};
