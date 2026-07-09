import { type ChangeEvent, useState } from 'react';
import { useController, useForm } from 'react-hook-form';

import { getTextInputStatusProps } from '../../hooks/get-text-input-status-props';
import {
  SIGNUP_FORM_DEFAULT_VALUES,
  signupFormResolver,
  type SignupFormTypes,
} from '../schemas/signup-schema';

export const useSignupForm = () => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();
  const form = useForm<SignupFormTypes>({
    defaultValues: SIGNUP_FORM_DEFAULT_VALUES,
    mode: 'onChange',
    resolver: signupFormResolver,
  });
  const emailController = useController({
    control: form.control,
    name: 'email',
  });
  const passwordController = useController({
    control: form.control,
    name: 'password',
  });
  const passwordConfirmController = useController({
    control: form.control,
    name: 'passwordConfirm',
  });

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSubmitErrorMessage(undefined);
    emailController.field.onChange(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSubmitErrorMessage(undefined);
    passwordController.field.onChange(event.target.value);
  };

  const handlePasswordConfirmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSubmitErrorMessage(undefined);
    passwordConfirmController.field.onChange(event.target.value);
  };

  const clearSubmitErrorMessage = () => {
    setSubmitErrorMessage(undefined);
  };

  const isPasswordConfirmValid =
    passwordConfirmController.field.value.length > 0 &&
    passwordConfirmController.fieldState.error === undefined;

  return {
    action: {
      clearSubmitErrorMessage,
      handleEmailChange,
      handlePasswordChange,
      handlePasswordConfirmChange,
      handleSubmit: form.handleSubmit,
    },
    state: {
      email: emailController.field.value,
      emailStatusProps: getTextInputStatusProps(emailController.fieldState.error?.message),
      isPasswordConfirmValid,
      isValid: form.formState.isValid,
      password: passwordController.field.value,
      passwordConfirm: passwordConfirmController.field.value,
      passwordConfirmStatusProps: getTextInputStatusProps(
        passwordConfirmController.fieldState.error?.message,
      ),
      passwordStatusProps: getTextInputStatusProps(passwordController.fieldState.error?.message),
      submitErrorMessage,
    },
  };
};
