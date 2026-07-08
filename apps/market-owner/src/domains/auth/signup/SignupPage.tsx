import type { FormEventHandler } from 'react';

import { Button, Flex, TextInput } from '@dongchimi/design-system/components';

import { useSignupForm } from './hooks/use-signup-form';
import * as S from './SignupPage.css';

const preventSignupSubmit: FormEventHandler<HTMLFormElement> = (event) => {
  event.preventDefault();
};

export const SignupPage = () => {
  const signupForm = useSignupForm();

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

      <form className={S.formClassName} onSubmit={preventSignupSubmit}>
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
            placeholder='비밀번호 입력'
            type='password'
            value={signupForm.password}
            {...signupForm.passwordStatusProps}
          />

          <TextInput
            autoComplete='new-password'
            label='비밀번호 확인'
            name='passwordConfirm'
            onChange={signupForm.handlePasswordConfirmChange}
            placeholder='비밀번호 확인'
            type='password'
            value={signupForm.passwordConfirm}
            {...signupForm.passwordConfirmStatusProps}
          />
        </Flex>

        <Button className={S.submitButtonClassName} disabled size='large' type='submit'>
          가입 완료
        </Button>
      </form>
    </main>
  );
};
