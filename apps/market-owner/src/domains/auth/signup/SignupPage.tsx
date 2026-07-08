import type { FormEventHandler } from 'react';

import { Button, Flex, TextInput } from '@dongchimi/design-system/components';

import * as S from './SignupPage.css';

const signupFields = [
  {
    autoComplete: 'email',
    label: '이메일',
    name: 'email',
    placeholder: 'example@email.com',
    type: 'email',
  },
  {
    autoComplete: 'new-password',
    label: '비밀번호',
    name: 'password',
    placeholder: '비밀번호 입력',
    type: 'password',
  },
  {
    autoComplete: 'new-password',
    label: '비밀번호 확인',
    name: 'passwordConfirm',
    placeholder: '비밀번호 확인',
    type: 'password',
  },
] as const;

const preventSignupSubmit: FormEventHandler<HTMLFormElement> = (event) => {
  event.preventDefault();
};

export const SignupPage = () => {
  return (
    <main className={S.pageClassName}>
      <Flex align='center' as='header' className={S.headerClassName} direction='column'>
        <Flex align='center' className={S.titleGroupClassName} direction='column'>
          <span aria-hidden='true' className={S.logoSlotClassName}>
            <img alt='' className={S.logoImageClassName} src='/favicon.svg' />
          </span>
          <h1 className={S.titleClassName}>회원가입</h1>
        </Flex>
        <p className={S.descriptionClassName}>
          회원가입을 하면 상품을 등록하고 할인 정보를 관리할 수 있어요.
        </p>
      </Flex>

      <form className={S.formClassName} onSubmit={preventSignupSubmit}>
        <Flex className={S.fieldGroupClassName} direction='column'>
          {signupFields.map((field) => (
            <TextInput
              key={field.name}
              autoComplete={field.autoComplete}
              label={field.label}
              name={field.name}
              placeholder={field.placeholder}
              type={field.type}
            />
          ))}
        </Flex>

        <Button className={S.submitButtonClassName} disabled size='large' type='submit'>
          가입 완료
        </Button>
      </form>
    </main>
  );
};
