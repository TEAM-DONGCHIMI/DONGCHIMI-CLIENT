const SIGNUP_PASSWORD_ERROR_MESSAGES = {
  format: '6-20자로 입력해주세요.',
  required: '비밀번호를 입력해주세요.',
} as const;

const MIN_SIGNUP_PASSWORD_LENGTH = 6;
const MAX_SIGNUP_PASSWORD_LENGTH = 20;
const KOREAN_CHARACTERS_PATTERN = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
const WHITESPACE_PATTERN = /\s/;

export type SignupPasswordValidationResultTypes =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
    };

export const validateSignupPassword = (password: string): SignupPasswordValidationResultTypes => {
  if (password.length === 0) {
    return { message: SIGNUP_PASSWORD_ERROR_MESSAGES.required, ok: false };
  }

  if (
    password.length < MIN_SIGNUP_PASSWORD_LENGTH ||
    MAX_SIGNUP_PASSWORD_LENGTH < password.length ||
    WHITESPACE_PATTERN.test(password) ||
    KOREAN_CHARACTERS_PATTERN.test(password)
  ) {
    return { message: SIGNUP_PASSWORD_ERROR_MESSAGES.format, ok: false };
  }

  return { ok: true };
};
