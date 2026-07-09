import { Button, TextInput, Toast } from '@dongchimi/design-system/components';
import { IcCheckboxActionSizeSmall, IcCheckboxSizeSmall } from '@dongchimi/design-system/icons';

import { useLoginForm } from '../../hooks/use-login-form';
import { type LoginSubmitHandlerTypes } from '../../hooks/use-login-submit';
import * as S from './LoginForm.css';

export interface LoginFormProps {
  submitLogin?: LoginSubmitHandlerTypes;
}

export const LoginForm = ({ submitLogin }: LoginFormProps = {}) => {
  const {
    action: { handleEmailChange, handleKeepSignedInChange, handlePasswordChange, handleSubmit },
    state: {
      email,
      emailStatusProps,
      isSubmitDisabled,
      keepSignedIn,
      loginErrorMessage,
      password,
      passwordStatusProps,
    },
  } = useLoginForm({ submitLogin });

  return (
    <form
      aria-label='마트 관리자 로그인'
      className={S.formClassName}
      noValidate
      onSubmit={handleSubmit}
    >
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
        <input
          checked={keepSignedIn}
          className={S.keepSignedInInputClassName}
          onChange={handleKeepSignedInChange}
          type='checkbox'
        />
        <span aria-hidden='true' className={S.keepSignedInIconClassName}>
          <IcCheckboxSizeSmall className={S.keepSignedInUncheckedIconClassName} />
          <IcCheckboxActionSizeSmall className={S.keepSignedInCheckedIconClassName} />
        </span>
        <span className={S.keepSignedInTextClassName}>로그인 상태 유지</span>
      </label>

      <Button
        className={S.fullWidthButtonClassName}
        disabled={isSubmitDisabled}
        size='medium'
        type='submit'
      >
        로그인
      </Button>

      {loginErrorMessage !== undefined && <Toast status='error'>{loginErrorMessage}</Toast>}
    </form>
  );
};
