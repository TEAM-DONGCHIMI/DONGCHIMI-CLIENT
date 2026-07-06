import { Link } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

export const TodaySpecialRegistrationPage = () => {
  return (
    <main>
      <p>상품 등록</p>
      <h1>오늘의 특가 상품 등록</h1>
      <p>좌측 사이드바가 있는 protected layout에서 오늘의 특가 상품 등록 route를 확인합니다.</p>
      <p>상품 등록 form, validation, submit mutation은 후속 작업에서 구현합니다.</p>
      <Link to={MARKET_OWNER_ROUTES.registrationResult}>등록 결과 확인 화면으로 이동</Link>
    </main>
  );
};
