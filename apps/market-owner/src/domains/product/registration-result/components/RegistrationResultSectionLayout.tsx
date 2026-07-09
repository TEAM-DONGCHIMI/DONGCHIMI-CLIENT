import { type ReactNode } from 'react';

import { IcCircleExclamationFillSizeXsmallColorNegative } from '@dongchimi/design-system/icons';

import * as S from './RegistrationResult.css';

interface RegistrationResultSectionLayoutProps {
  children: ReactNode;
  needsEditCount: number;
  registerDisabled: boolean;
  onPrevious: () => void;
  onRegister: () => void;
}

export const RegistrationResultSectionLayout = ({
  children,
  needsEditCount,
  registerDisabled,
  onPrevious,
  onRegister,
}: RegistrationResultSectionLayoutProps) => {
  return (
    <section aria-labelledby='registration-result-title' className={S.sectionClassName}>
      <div className={S.headingContainerClassName}>
        <h1 className={S.titleClassName} id='registration-result-title'>
          상품 결과 등록 확인
        </h1>
        <p className={S.descriptionClassName}>
          AI가 상품 정보를 분석했습니다. 등록 전 내용을 확인해주세요. (
          <span className={S.requiredMarkClassName}>*</span>) 표시는 필수 입력 사항입니다.
        </p>
      </div>

      <div className={S.tableContainerClassName}>{children}</div>

      <div className={S.bottomBarClassName}>
        <p aria-live='polite' className={S.statusNoticeRecipe({ visible: registerDisabled })}>
          <IcCircleExclamationFillSizeXsmallColorNegative aria-hidden='true' />
          <span>확인이 필요한 상품이 있어요 ({needsEditCount})</span>
        </p>

        <div className={S.actionGroupClassName}>
          <button className={S.previousButtonClassName} onClick={onPrevious} type='button'>
            이전
          </button>
          <button
            className={S.registerButtonClassName}
            disabled={registerDisabled}
            onClick={onRegister}
            type='button'
          >
            등록 완료
          </button>
        </div>
      </div>
    </section>
  );
};
