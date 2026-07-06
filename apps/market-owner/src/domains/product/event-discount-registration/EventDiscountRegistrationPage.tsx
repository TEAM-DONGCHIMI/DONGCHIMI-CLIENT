import { Link } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

export const EventDiscountRegistrationPage = () => {
  return (
    <main>
      <p>상품 등록</p>
      <h1>행사 할인 상품 등록</h1>
      <p>좌측 사이드바가 있는 protected layout에서 행사 할인 상품 등록 route를 확인합니다.</p>
      <p>행사 기간, 상품 목록, 등록 submit flow는 후속 form/API 이슈에서 구현합니다.</p>
      <Link to={MARKET_OWNER_ROUTES.registrationResult}>등록 결과 확인 화면으로 이동</Link>
    </main>
  );
};
