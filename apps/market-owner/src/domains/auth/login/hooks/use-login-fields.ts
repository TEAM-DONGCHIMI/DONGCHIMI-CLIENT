import { type ChangeEvent } from 'react';
import { useController, useForm } from 'react-hook-form';

import { getTextInputStatusProps } from '../../hooks/get-text-input-status-props';
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

  const emailStatusProps = getTextInputStatusProps(emailController.fieldState.error?.message);
  const passwordStatusProps = getTextInputStatusProps(passwordController.fieldState.error?.message);

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
    action: {
      handleEmailChange,
      handleKeepSignedInChange,
      handlePasswordChange,
      handleSubmit: form.handleSubmit,
    },
    state: {
      email: emailController.field.value,
      emailStatusProps,
      isValid: form.formState.isValid,
      keepSignedIn: isAutoLoginController.field.value,
      password: passwordController.field.value,
      passwordStatusProps,
    },
  };
};
