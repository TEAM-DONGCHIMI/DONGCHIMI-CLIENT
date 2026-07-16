import { type ReactNode } from 'react';

import { Flex, StatusChip } from '@dongchimi/design-system/components';
import {
  IcCircleCheckFillSizeSmall,
  IcCircleExclamationFillSizeXsmallColorNegative,
} from '@dongchimi/design-system/icons';

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
  const hasNeedsEditProducts = needsEditCount > 0;

  return (
    <Flex
      aria-labelledby='registration-result-title'
      as='section'
      className={S.sectionClassName}
      direction='column'
    >
      <Flex className={S.headingContainerClassName} direction='column'>
        <h1 className={S.titleClassName} id='registration-result-title'>
          상품 결과 등록 확인
        </h1>
        <p className={S.descriptionClassName}>
          AI가 상품 정보를 분석했습니다. 등록 전 내용을 확인해주세요. (
          <span className={S.requiredMarkClassName}>*</span>) 표시는 필수 입력 사항입니다.
        </p>
      </Flex>

      <Flex className={S.tableContainerClassName} direction='column'>
        {children}
      </Flex>

      <Flex align='center' className={S.bottomBarClassName} justify='between'>
        {hasNeedsEditProducts ? (
          <p aria-live='polite' className={S.statusNoticeClassName}>
            <IcCircleExclamationFillSizeXsmallColorNegative aria-hidden='true' />
            <span>확인이 필요한 상품이 있어요 ({needsEditCount})</span>
          </p>
        ) : (
          <StatusChip
            aria-live='polite'
            className={S.successStatusNoticeClassName}
            leftIcon={
              <IcCircleCheckFillSizeSmall aria-hidden='true' height='1.6rem' width='1.6rem' />
            }
            status='success'
          >
            모든 상품의 확인이 완료되었어요
          </StatusChip>
        )}

        <Flex align='center' className={S.actionGroupClassName}>
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
        </Flex>
      </Flex>
    </Flex>
  );
};
