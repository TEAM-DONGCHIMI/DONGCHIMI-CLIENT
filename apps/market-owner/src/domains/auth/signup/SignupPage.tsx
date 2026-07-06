import { Link } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

export const SignupPage = () => {
  return (
    <main>
      <p>Public Auth</p>
      <h1>회원가입</h1>
      <p>
        회원가입 화면은 public auth layout에서 sidebar 없이 렌더링됩니다. 상세 form validation은
        후속 이슈 범위입니다.
      </p>
      <p>가입 form 구현 전 route 진입과 public layout boundary를 확인합니다.</p>
      <Link to={MARKET_OWNER_ROUTES.login}>로그인으로 이동</Link>
    </main>
  );
};
