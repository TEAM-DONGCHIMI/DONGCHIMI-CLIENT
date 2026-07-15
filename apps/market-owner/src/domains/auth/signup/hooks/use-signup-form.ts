import { type ChangeEvent } from 'react';
import { useController, useForm } from 'react-hook-form';

import { getVisibleFieldErrorMessage } from '@/shared/utils/form-error.utils';

import { getTextInputStatusProps } from '../../hooks/get-text-input-status-props';
import {
  SIGNUP_FORM_DEFAULT_VALUES,
  signupFormResolver,
  type SignupFormTypes,
} from '../schemas/signup-schema';
import { useSignupSubmit } from './use-signup-submit';

export const useSignupForm = () => {
  const {
    action: { clearSubmitErrorMessage, submit },
    state: { isSubmitting },
  } = useSignupSubmit();
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

  const createFieldChangeHandler =
    (onFieldChange: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      clearSubmitErrorMessage();
      onFieldChange(event.target.value);
    };

  const handleEmailChange = createFieldChangeHandler(emailController.field.onChange);
  const handlePasswordChange = createFieldChangeHandler(passwordController.field.onChange);
  const handlePasswordConfirmChange = createFieldChangeHandler(
    passwordConfirmController.field.onChange,
  );

  const isPasswordConfirmValid =
    passwordConfirmController.field.value.length > 0 &&
    passwordConfirmController.fieldState.error === undefined;
  const isSubmitted = form.formState.isSubmitted;
  const emailErrorMessage = getVisibleFieldErrorMessage({
    error: emailController.fieldState.error,
    isSubmitted,
    isTouched: emailController.fieldState.isTouched,
  });
  const passwordErrorMessage = getVisibleFieldErrorMessage({
    error: passwordController.fieldState.error,
    isSubmitted,
    isTouched: passwordController.fieldState.isTouched,
  });
  const passwordConfirmErrorMessage = getVisibleFieldErrorMessage({
    error: passwordConfirmController.fieldState.error,
    isSubmitted,
    isTouched: passwordConfirmController.fieldState.isTouched,
  });
  const isSubmitDisabled = isSubmitting || !form.formState.isValid;
  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    if (isSubmitting) {
      return;
    }

    await submit({ email, password });
  });

  return {
    action: {
      handleEmailBlur: emailController.field.onBlur,
      handleEmailChange,
      handlePasswordBlur: passwordController.field.onBlur,
      handlePasswordChange,
      handlePasswordConfirmBlur: passwordConfirmController.field.onBlur,
      handlePasswordConfirmChange,
      handleSubmit,
    },
    state: {
      email: emailController.field.value,
      emailStatusProps: getTextInputStatusProps(emailErrorMessage),
      isPasswordConfirmValid,
      isSubmitDisabled,
      isSubmitting,
      password: passwordController.field.value,
      passwordConfirm: passwordConfirmController.field.value,
      passwordConfirmStatusProps: getTextInputStatusProps(passwordConfirmErrorMessage),
      passwordStatusProps: getTextInputStatusProps(passwordErrorMessage),
    },
  };
};
