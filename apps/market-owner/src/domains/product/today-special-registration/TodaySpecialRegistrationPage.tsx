import { useNavigate } from 'react-router';

import { Button } from '@dongchimi/design-system/components';
import { IcCirclePlusSizeSmall } from '@dongchimi/design-system/icons';

import { DesktopHeader } from '@/shared/components/ui/desktop-header/DesktopHeader';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { useTodaySpecialRegistrationForm } from './hooks/useTodaySpecialRegistrationForm';
import {
  ProductInfoSection,
  ProductPeriodSection,
  ProductPriceSection,
  RegistrationTitleSection,
} from './sections';
import * as S from './TodaySpecialRegistrationPage.css';

export const TodaySpecialRegistrationPage = () => {
  const navigate = useNavigate();
  const {
    actionSectionProps,
    handleFormSubmit,
    productInfoSectionProps,
    productPeriodSectionProps,
    productPriceSectionProps,
    titleSectionProps,
  } = useTodaySpecialRegistrationForm({
    onSubmit: () => {
      // TODO: presigned URL 발급, storage PUT, 상품 payload submit 순서로 API 연동.
      navigate(MARKET_OWNER_ROUTES.home);
    },
  });

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader currentLabel='오늘의 특가 상품 등록' parentLabel='홈' showSearchBar={false} />

      <form onSubmit={handleFormSubmit}>
        <section
          className={S.formContentClassName}
          aria-labelledby='today-special-registration-title'
        >
          <RegistrationTitleSection {...titleSectionProps} />

          <div className={S.fieldSectionsClassName}>
            <ProductInfoSection {...productInfoSectionProps} />
            <ProductPriceSection {...productPriceSectionProps} />
            <ProductPeriodSection {...productPeriodSectionProps} />
          </div>

          <footer className={S.actionSectionClassName}>
            <Button
              className={S.actionButtonClassName}
              color='assistive'
              leftIcon={<IcCirclePlusSizeSmall />}
              onClick={actionSectionProps.onAddProduct}
              size='small'
              variant='outlined'
            >
              상품 계속 등록
            </Button>
            <Button
              className={S.actionButtonClassName}
              disabled={actionSectionProps.isSubmitDisabled}
              size='small'
              type='submit'
            >
              등록 완료
            </Button>
          </footer>
        </section>
      </form>
    </main>
  );
};
