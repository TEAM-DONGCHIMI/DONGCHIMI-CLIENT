import { useCallback, useEffect, useRef, useState } from 'react';

import { useBlocker, useNavigate } from 'react-router';
import { useToast } from '@dongchimi/shared/toast';

import { Button } from '@dongchimi/design-system/components';

import {
  MarketInformationForm,
  MarketInformationFormToastProvider,
} from '@/domains/market/components/market-information-form';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { confirmMarketInformationLeave } from './components';
import { marketInformationManagementFixture } from './fixtures';
import * as S from './MarketInformationManagementPage.css';

const MarketInformationManagementPageController = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isDirty, setIsDirty] = useState(false);
  const isLeaveConfirmationOpenRef = useRef(false);
  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (blocker.state !== 'blocked' || isLeaveConfirmationOpenRef.current) return;

    isLeaveConfirmationOpenRef.current = true;
    void confirmMarketInformationLeave().then((shouldLeave) => {
      isLeaveConfirmationOpenRef.current = false;
      if (shouldLeave) {
        blocker.proceed();
        return;
      }

      blocker.reset();
    });
  }, [blocker]);

  const handleDirtyChange = useCallback((nextIsDirty: boolean) => {
    setIsDirty(nextIsDirty);
  }, []);

  const handleCancel = () => {
    navigate(MARKET_OWNER_ROUTES.home);
  };

  return (
    <MarketInformationForm
      description='점주님의 마트 정보를 관리하세요.'
      initialForm={marketInformationManagementFixture.initialForm}
      secondaryAction={
        <Button
          className={S.actionButtonClassName}
          color='assistive'
          size='medium'
          type='button'
          variant='outlined'
          onClick={handleCancel}
        >
          취소
        </Button>
      }
      submitAreaClassName={S.actionAreaClassName}
      submitButtonClassName={S.actionButtonClassName}
      submitDisabled={!isDirty}
      submitLabel='수정 완료'
      title='마트 정보 관리'
      onDirtyChange={handleDirtyChange}
      onSubmit={async (_request, _form, reset) => {
        reset();
        toast.completed('정보가 변경되었습니다.', {
          id: 'market-information-management-completed',
        });
      }}
    />
  );
};

export const MarketInformationManagementPage = () => (
  <MarketInformationFormToastProvider offset='2.4rem' placement='top-center'>
    <MarketInformationManagementPageController />
  </MarketInformationFormToastProvider>
);
