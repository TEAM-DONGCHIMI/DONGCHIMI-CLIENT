import { Link } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import * as S from './SignupPrompt.css';

export const SignupPrompt = () => {
  return (
    <div className={S.rootClassName}>
      <p className={S.promptClassName}>아직 회원이 아니신가요?</p>
      <Link className={S.linkClassName} to={MARKET_OWNER_ROUTES.signup}>
        회원가입
      </Link>
    </div>
  );
};
