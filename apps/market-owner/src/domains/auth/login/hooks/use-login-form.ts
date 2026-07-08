import { useLoginFields } from './use-login-fields';
import { type LoginSubmitHandlerTypes, useLoginSubmit } from './use-login-submit';

export interface UseLoginFormOptions {
  submitLogin?: LoginSubmitHandlerTypes;
}

export const useLoginForm = ({ submitLogin }: UseLoginFormOptions = {}) => {
  const { clearLoginErrorMessage, isSubmitting, loginErrorMessage, submit } = useLoginSubmit({
    submitLogin,
  });
  const fields = useLoginFields({ onFieldChange: clearLoginErrorMessage });
  const isSubmitDisabled = isSubmitting || !fields.isValid;

  const handleSubmit = fields.handleSubmit(async (values) => {
    if (isSubmitting) {
      return;
    }

    await submit({
      email: values.email,
      isAutoLogin: values.isAutoLogin,
      password: values.password,
    });
  });

  return {
    email: fields.email,
    emailStatusProps: fields.emailStatusProps,
    handleEmailChange: fields.handleEmailChange,
    handleKeepSignedInChange: fields.handleKeepSignedInChange,
    handlePasswordChange: fields.handlePasswordChange,
    handleSubmit,
    isSubmitting,
    isSubmitDisabled,
    keepSignedIn: fields.keepSignedIn,
    loginErrorMessage,
    password: fields.password,
    passwordStatusProps: fields.passwordStatusProps,
  };
};
