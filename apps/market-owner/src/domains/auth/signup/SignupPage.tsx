import { useNavigate } from 'react-router';

import { Button, Flex, TextInput, Toast } from '@dongchimi/design-system/components';
import { IcCircleCheckFill } from '@dongchimi/design-system/icons';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { useSignupForm } from './hooks/use-signup-form';
import * as S from './SignupPage.css';

export const SignupPage = () => {
  const navigate = useNavigate();
  const signupForm = useSignupForm();
  const handleSignupSubmit = signupForm.handleSubmit(() => {
    signupForm.clearSubmitErrorMessage();
    navigate(MARKET_OWNER_ROUTES.login);
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

      <form className={S.formClassName} onSubmit={handleSignupSubmit}>
        <Flex className={S.fieldGroupClassName} direction='column'>
          <TextInput
            autoComplete='email'
            label='이메일'
            name='email'
            onChange={signupForm.handleEmailChange}
            placeholder='example@email.com'
            type='email'
            value={signupForm.email}
            {...signupForm.emailStatusProps}
          />

          <TextInput
            autoComplete='new-password'
            label='비밀번호'
            name='password'
            onChange={signupForm.handlePasswordChange}
            placeholder='비밀번호를 입력해주세요.'
            type='password'
            value={signupForm.password}
            {...signupForm.passwordStatusProps}
          />

          <TextInput
            autoComplete='new-password'
            label='비밀번호 확인'
            name='passwordConfirm'
            onChange={signupForm.handlePasswordConfirmChange}
            placeholder='비밀번호를 확인해주세요.'
            trailingIcon={signupForm.isPasswordConfirmValid ? <IcCircleCheckFill /> : undefined}
            type='password'
            value={signupForm.passwordConfirm}
            {...signupForm.passwordConfirmStatusProps}
          />
        </Flex>

        {signupForm.submitErrorMessage !== undefined && (
          <div className={S.submitToastClassName}>
            <Toast status='error'>{signupForm.submitErrorMessage}</Toast>
          </div>
        )}

        <Button
          className={S.submitButtonClassName}
          disabled={!signupForm.isValid}
          size='large'
          type='submit'
        >
          가입 완료
        </Button>
      </form>
    </main>
  );
};
