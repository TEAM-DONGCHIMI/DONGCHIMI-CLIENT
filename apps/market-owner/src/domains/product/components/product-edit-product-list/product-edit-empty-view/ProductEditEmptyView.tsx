import { useNavigate } from 'react-router';

import { Button } from '@dongchimi/design-system/components';

import ImageEmpty from './ImageEmpty';
import * as S from './ProductEditEmptyView.css';

interface ProductEditEmptyViewProps {
  ariaLabel: string;
  registrationHref: string;
}

export const ProductEditEmptyView = ({
  ariaLabel,
  registrationHref,
}: ProductEditEmptyViewProps) => {
  const navigate = useNavigate();

  return (
    <section aria-label={ariaLabel} className={S.emptySectionClassName}>
      <ImageEmpty aria-hidden='true' className={S.emptyImageClassName} focusable='false' />
      <div className={S.emptyContentClassName}>
        <div className={S.emptyTextBlockClassName}>
          <h2 className={S.emptyTitleClassName}>등록된 상품이 존재하지 않아요!</h2>
          <p className={S.emptyDescriptionClassName}>
            상품을 추가 등록해 오늘의 알찬 전단을 만들어보세요.
          </p>
        </div>
        <Button
          className={S.registrationButtonClassName}
          color='assistive'
          size='small'
          variant='solid'
          onClick={() => navigate(registrationHref)}
        >
          상품 등록하러 가기
        </Button>
      </div>
    </section>
  );
};
