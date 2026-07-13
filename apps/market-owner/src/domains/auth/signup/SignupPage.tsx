import { useNavigate } from 'react-router';

import { Button, Flex, TextInput, Toast } from '@dongchimi/design-system/components';
import { IcCircleCheckFill } from '@dongchimi/design-system/icons';

import { isApiError } from '@/shared/api';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { useSignupMutation } from '../hooks/use-signup-mutation';
import { useSignupForm } from './hooks/use-signup-form';
import * as S from './SignupPage.css';

const SIGNUP_FALLBACK_ERROR_MESSAGE = '회원가입에 실패했습니다. 다시 시도해주세요.';

const getSignupErrorMessage = (error: unknown) => {
  if (isApiError(error) && error.message.length > 0) {
    return error.message;
  }

  return SIGNUP_FALLBACK_ERROR_MESSAGE;
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const {
    action: {
      clearSubmitErrorMessage,
      handleEmailBlur,
      handleEmailChange,
      handlePasswordBlur,
      handlePasswordChange,
      handlePasswordConfirmBlur,
      handlePasswordConfirmChange,
      handleSubmit,
      setSubmitErrorMessage,
    },
    state: {
      email,
      emailStatusProps,
      isPasswordConfirmValid,
      isValid,
      password,
      passwordConfirm,
      passwordConfirmStatusProps,
      passwordStatusProps,
      submitErrorMessage,
    },
  } = useSignupForm();
  const handleSignupSubmit = handleSubmit(async ({ email, password }) => {
    clearSubmitErrorMessage();

    try {
      await signupMutation.mutateAsync({
        email,
        password,
      });
      navigate(MARKET_OWNER_ROUTES.login);
    } catch (error) {
      setSubmitErrorMessage(getSignupErrorMessage(error));
    }
  });

  return (
    <main className={S.pageClassName}>
      <Flex align='center' as='header' className={S.headerClassName} direction='column'>
        <Flex align='center' className={S.titleGroupClassName} direction='column'>
          <span aria-hidden='true' className={S.logoSlotClassName} />
          <h1 className={S.titleClassName}>회원가입</h1>
        </Flex>
        <p className={S.descriptionClassName}>
          회원가입을 하면 상품을 등록하고 할인 정보를 관리할 수 있어요.
        </p>
      </Flex>

      <form className={S.formClassName} noValidate onSubmit={handleSignupSubmit}>
        <Flex className={S.fieldGroupClassName} direction='column'>
          <TextInput
            autoComplete='email'
            label='이메일'
            name='email'
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            placeholder='example@email.com'
            type='email'
            value={email}
            {...emailStatusProps}
          />

          <TextInput
            autoComplete='new-password'
            label='비밀번호'
            name='password'
            onBlur={handlePasswordBlur}
            onChange={handlePasswordChange}
            placeholder='비밀번호를 입력해주세요.'
            type='password'
            value={password}
            {...passwordStatusProps}
          />

          <TextInput
            autoComplete='new-password'
            label='비밀번호 확인'
            name='passwordConfirm'
            onBlur={handlePasswordConfirmBlur}
            onChange={handlePasswordConfirmChange}
            placeholder='비밀번호를 확인해주세요.'
            trailingIcon={isPasswordConfirmValid ? <IcCircleCheckFill /> : undefined}
            type='password'
            value={passwordConfirm}
            {...passwordConfirmStatusProps}
          />
        </Flex>

        {submitErrorMessage !== undefined && (
          <div className={S.submitToastClassName}>
            <Toast status='error'>{submitErrorMessage}</Toast>
          </div>
        )}

        <Button
          className={S.submitButtonClassName}
          disabled={!isValid || signupMutation.isPending}
          size='large'
          type='submit'
        >
          가입 완료
        </Button>
      </form>
    </main>
  );
};
