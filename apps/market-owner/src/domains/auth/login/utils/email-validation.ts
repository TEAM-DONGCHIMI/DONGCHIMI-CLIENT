export const EMAIL_ERROR_MESSAGES = {
  required: '이메일을 입력해주세요.',
  invalidFormat: '올바른 이메일 형식이 아닙니다.',
} as const;

const EMAIL_ALLOWED_CHARACTERS_PATTERN = /^[A-Za-z0-9@._-]*$/;
export const EMAIL_PATTERN = /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+(?:\.[A-Za-z]{2,})+$/;

export const isAllowedEmailInputValue = (email: string) => {
  return EMAIL_ALLOWED_CHARACTERS_PATTERN.test(email);
};

export const getEmailErrorMessage = (email: string) => {
  if (email.length === 0) {
    return EMAIL_ERROR_MESSAGES.required;
  }

  if (!EMAIL_PATTERN.test(email)) {
    return EMAIL_ERROR_MESSAGES.invalidFormat;
  }

  return undefined;
};
