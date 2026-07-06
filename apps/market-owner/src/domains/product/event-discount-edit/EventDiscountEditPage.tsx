import { Link } from 'react-router';

import { TabNav } from '@dongchimi/design-system/components';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

export const EventDiscountEditPage = () => {
  return (
    <main>
      <p>상품 수정</p>
      <h1>행사 할인 상품 수정</h1>
      <p>사이드바의 행사 할인 상품 수정 메뉴와 상단 탭이 같은 route 상태를 가리킵니다.</p>
      <TabNav aria-label='상품 수정 유형'>
        <TabNav.List>
          <TabNav.Item as={Link} to={MARKET_OWNER_ROUTES.todaySpecialEdit}>
            오늘의 특가
          </TabNav.Item>
          <TabNav.Item as={Link} selected to={MARKET_OWNER_ROUTES.eventDiscountEdit}>
            행사 할인
          </TabNav.Item>
        </TabNav.List>
      </TabNav>
      <p>행사 할인 상품 수정 table, 기간 필터, selection, API 연동은 후속 이슈 범위입니다.</p>
    </main>
  );
};
