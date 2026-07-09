export const PASSWORD_ERROR_MESSAGES = {
  required: '비밀번호를 입력해주세요.',
} as const;

export const getPasswordErrorMessage = (password: string) => {
  if (password.length === 0) {
    return PASSWORD_ERROR_MESSAGES.required;
  }

  return undefined;
};
