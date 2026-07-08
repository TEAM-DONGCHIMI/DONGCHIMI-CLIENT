const SIGNUP_PASSWORD_CONFIRM_ERROR_MESSAGES = {
  mismatch: '비밀번호가 일치하지 않습니다.',
  required: '비밀번호를 다시 입력해주세요.',
} as const;

export type SignupPasswordConfirmValidationResultTypes =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
    };

export const validateSignupPasswordConfirm = (
  passwordConfirm: string,
  password: string,
): SignupPasswordConfirmValidationResultTypes => {
  if (passwordConfirm.length === 0) {
    return { message: SIGNUP_PASSWORD_CONFIRM_ERROR_MESSAGES.required, ok: false };
  }

  if (passwordConfirm !== password) {
    return { message: SIGNUP_PASSWORD_CONFIRM_ERROR_MESSAGES.mismatch, ok: false };
  }

  return { ok: true };
};
