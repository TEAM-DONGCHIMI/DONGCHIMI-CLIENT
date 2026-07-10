import { useNavigate } from 'react-router';

import { DesktopHeader } from '@/shared/components';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { registrationResultFixture } from './fixtures';
import * as S from './RegistrationResultPage.css';
import { RegistrationResultSection } from './sections';

export const RegistrationResultPage = () => {
  const navigate = useNavigate();

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader
        className={S.pageHeaderClassName}
        currentLabel='상품 결과 등록 확인'
        logo={<span aria-hidden='true' className={S.logoPlaceholderClassName} />}
        parentLabel='행사 할인 상품 등록'
        showSearchBar={false}
      />

      <RegistrationResultSection
        pageSize={registrationResultFixture.pageSize}
        products={registrationResultFixture.products}
        summary={registrationResultFixture.summary}
        onPrevious={() => navigate(MARKET_OWNER_ROUTES.eventDiscountRegistration)}
        onRegister={() => undefined}
      />
    </main>
  );
};
