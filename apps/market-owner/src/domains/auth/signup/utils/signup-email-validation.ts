const SIGNUP_EMAIL_ERROR_MESSAGES = {
  duplicated: '이미 사용 중인 이메일입니다.',
  format: '올바른 이메일 형식이 아닙니다.',
  required: '이메일을 입력해주세요.',
} as const;

const USED_SIGNUP_EMAILS = new Set(['used@example.com', 'owner@email.co.kr']);

const SIGNUP_EMAIL_PATTERN = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.(?:com|co\.kr)$/;
const SIGNUP_EMAIL_ALLOWED_CHARACTERS_PATTERN = /^[A-Za-z0-9@._-]*$/;
const KOREAN_CHARACTERS_PATTERN = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
const WHITESPACE_PATTERN = /\s/;

export type SignupEmailValidationResultTypes =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
    };

const isUsedSignupEmail = (email: string) => {
  return USED_SIGNUP_EMAILS.has(email.toLowerCase());
};

export const validateSignupEmail = (email: string): SignupEmailValidationResultTypes => {
  if (email.length === 0) {
    return { message: SIGNUP_EMAIL_ERROR_MESSAGES.required, ok: false };
  }

  if (
    WHITESPACE_PATTERN.test(email) ||
    KOREAN_CHARACTERS_PATTERN.test(email) ||
    !SIGNUP_EMAIL_ALLOWED_CHARACTERS_PATTERN.test(email) ||
    !SIGNUP_EMAIL_PATTERN.test(email)
  ) {
    return { message: SIGNUP_EMAIL_ERROR_MESSAGES.format, ok: false };
  }

  if (isUsedSignupEmail(email)) {
    return { message: SIGNUP_EMAIL_ERROR_MESSAGES.duplicated, ok: false };
  }

  return { ok: true };
};
