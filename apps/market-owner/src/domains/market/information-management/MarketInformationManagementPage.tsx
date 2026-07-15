import { useCallback, useEffect, useRef, useState } from 'react';

import { useBlocker, useNavigate } from 'react-router';
import { useToast } from '@dongchimi/shared/toast';

import { Button, TextButton } from '@dongchimi/design-system/components';

import {
  MarketInformationForm,
  MarketInformationFormToastProvider,
} from '@/domains/market/components/market-information-form';
import { useOwnerMarketDetailQuery, useUpdateOwnerMarketMutation } from '@/domains/market/hooks';
import { createMarketInformationForm } from '@/domains/market/model';
import { isApiError } from '@/shared/api';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';

import { confirmMarketInformationLeave } from './components';
import * as S from './MarketInformationManagementPage.css';

const getMarketDetailErrorMessage = (error: unknown) => {
  if (isApiError(error)) {
    if (error.code === 'MARKET_ACCESS_DENIED') {
      return '해당 마트 정보를 조회할 권한이 없습니다.';
    }

    if (error.code === 'MARKET_NOT_FOUND') {
      return '마트 정보를 찾을 수 없습니다.';
    }
  }

  return '마트 정보를 불러오지 못했어요.';
};

const getMarketUpdateErrorMessage = (error: unknown) => {
  if (
    isApiError(error) &&
    (error.code === 'INVALID_INPUT' ||
      error.code === 'MARKET_ACCESS_DENIED' ||
      error.code === 'MARKET_NOT_FOUND' ||
      error.code === 'MARKET_ALREADY_EXISTS')
  ) {
    return error.message;
  }

  return '마트 정보를 수정하지 못했습니다. 잠시 후 다시 시도해주세요.';
};

const MarketInformationManagementPageController = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const marketId = useAuthStore((state) => state.marketId);
  const marketDetailQuery = useOwnerMarketDetailQuery({ marketId });
  const updateOwnerMarketMutation = useUpdateOwnerMarketMutation();
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

  if (marketId == null) {
    return (
      <div className={S.queryStateClassName} role='alert'>
        마트 정보를 확인할 수 없습니다. 다시 로그인해주세요.
      </div>
    );
  }

  if (marketDetailQuery.isPending) {
    return (
      <div className={S.queryStateClassName} role='status'>
        마트 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (marketDetailQuery.isError || marketDetailQuery.data === undefined) {
    return (
      <div className={S.queryStateClassName} role='alert'>
        <p className={S.queryErrorMessageClassName}>
          {getMarketDetailErrorMessage(marketDetailQuery.error)}
        </p>
        <TextButton onClick={() => void marketDetailQuery.refetch()}>다시 불러오기</TextButton>
      </div>
    );
  }

  return (
    <MarketInformationForm
      getSubmitErrorMessage={getMarketUpdateErrorMessage}
      description='점주님의 마트 정보를 관리하세요.'
      initialForm={createMarketInformationForm(marketDetailQuery.data)}
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
      submitDisabled={!isDirty || updateOwnerMarketMutation.isPending}
      submitLabel={updateOwnerMarketMutation.isPending ? '수정 중...' : '수정 완료'}
      title='마트 정보 관리'
      onDirtyChange={handleDirtyChange}
      onSubmit={async (request, _form, reset) => {
        const response = await updateOwnerMarketMutation.mutateAsync({ marketId, request });

        reset();
        toast.completed(response.message, {
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
