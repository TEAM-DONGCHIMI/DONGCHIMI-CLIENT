import { Button, TextInput } from '@dongchimi/design-system/components';
import { IcCheckboxActionSizeSmall, IcCheckboxSizeSmall } from '@dongchimi/design-system/icons';

import { useLoginForm } from '../../hooks/use-login-form';
import * as S from './LoginForm.css';

export const LoginForm = () => {
  const {
    email,
    emailStatusProps,
    handleEmailChange,
    handlePasswordChange,
    password,
    passwordStatusProps,
  } = useLoginForm();

  return (
    <form aria-label='마트 관리자 로그인' className={S.formClassName} noValidate>
      <TextInput
        {...emailStatusProps}
        autoComplete='email'
        label='이메일'
        onChange={handleEmailChange}
        placeholder='이메일을 입력해주세요.'
        type='email'
        value={email}
      />
      <TextInput
        {...passwordStatusProps}
        autoComplete='current-password'
        label='비밀번호'
        onChange={handlePasswordChange}
        placeholder='비밀번호를 입력해주세요.'
        type='password'
        value={password}
      />

      <label className={S.keepSignedInClassName}>
        <input className={S.keepSignedInInputClassName} type='checkbox' />
        <span aria-hidden='true' className={S.keepSignedInIconClassName}>
          <IcCheckboxSizeSmall className={S.keepSignedInUncheckedIconClassName} />
          <IcCheckboxActionSizeSmall className={S.keepSignedInCheckedIconClassName} />
        </span>
        <span className={S.keepSignedInTextClassName}>로그인 상태 유지</span>
      </label>

      <Button className={S.fullWidthButtonClassName} disabled size='medium' type='submit'>
        로그인
      </Button>
    </form>
  );
};
