import { type ChangeEvent } from 'react';
import { useController, useForm } from 'react-hook-form';

import {
  LOGIN_FORM_DEFAULT_VALUES,
  loginFormResolver,
  type LoginFormTypes,
} from '../schemas/login-schema';
import { isAllowedEmailInputValue } from '../utils/email-validation';

interface UseLoginFieldsOptions {
  onFieldChange?: () => void;
}

export const useLoginFields = ({ onFieldChange }: UseLoginFieldsOptions = {}) => {
  const form = useForm<LoginFormTypes>({
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
    mode: 'onChange',
    resolver: loginFormResolver,
  });
  const emailController = useController({
    control: form.control,
    name: 'email',
  });
  const passwordController = useController({
    control: form.control,
    name: 'password',
  });
  const isAutoLoginController = useController({
    control: form.control,
    name: 'isAutoLogin',
  });

  const emailErrorMessage = emailController.fieldState.error?.message;
  const emailStatusProps =
    emailErrorMessage !== undefined
      ? { errorMessage: emailErrorMessage, status: 'error' as const }
      : { status: 'default' as const };
  const passwordErrorMessage = passwordController.fieldState.error?.message;
  const passwordStatusProps =
    passwordErrorMessage !== undefined
      ? { errorMessage: passwordErrorMessage, status: 'error' as const }
      : { status: 'default' as const };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextEmail = event.target.value;

    onFieldChange?.();

    if (isAllowedEmailInputValue(nextEmail)) {
      emailController.field.onChange(nextEmail);
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFieldChange?.();
    passwordController.field.onChange(event.target.value);
  };

  const handleKeepSignedInChange = (event: ChangeEvent<HTMLInputElement>) => {
    isAutoLoginController.field.onChange(event.target.checked);
  };

  return {
    email: emailController.field.value,
    emailStatusProps,
    handleEmailChange,
    handleKeepSignedInChange,
    handlePasswordChange,
    handleSubmit: form.handleSubmit,
    isValid: form.formState.isValid,
    keepSignedIn: isAutoLoginController.field.value,
    password: passwordController.field.value,
    passwordStatusProps,
  };
};
