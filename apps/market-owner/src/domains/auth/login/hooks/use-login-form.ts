import { useLoginFields } from './use-login-fields';
import { type LoginSubmitHandlerTypes, useLoginSubmit } from './use-login-submit';

export interface UseLoginFormOptions {
  submitLogin?: LoginSubmitHandlerTypes;
}

export const useLoginForm = ({ submitLogin }: UseLoginFormOptions = {}) => {
  const {
    action: { clearLoginErrorMessage, submit },
    state: { isSubmitting, loginErrorMessage },
  } = useLoginSubmit({ submitLogin });
  const fields = useLoginFields({ onFieldChange: clearLoginErrorMessage });
  const isSubmitDisabled = isSubmitting || !fields.state.isValid;

  const handleSubmit = fields.action.handleSubmit(async (values) => {
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
    action: {
      handleEmailBlur: fields.action.handleEmailBlur,
      handleEmailChange: fields.action.handleEmailChange,
      handleKeepSignedInChange: fields.action.handleKeepSignedInChange,
      handlePasswordBlur: fields.action.handlePasswordBlur,
      handlePasswordChange: fields.action.handlePasswordChange,
      handleSubmit,
    },
    state: {
      email: fields.state.email,
      emailStatusProps: fields.state.emailStatusProps,
      isSubmitDisabled,
      isSubmitting,
      keepSignedIn: fields.state.keepSignedIn,
      loginErrorMessage,
      password: fields.state.password,
      passwordStatusProps: fields.state.passwordStatusProps,
    },
  };
};
