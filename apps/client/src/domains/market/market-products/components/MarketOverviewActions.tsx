'use client';

import { useState } from 'react';

import { MobileModal } from '@/shared/components/ui/mobile-modal';

import type { BusinessHourTypes } from '../fixtures/market-products.fixture';
import * as S from '../MarketProductsPage.css';
import {
  getCallModalDescription,
  getCurrentBusinessCloseTime,
  getTelHref,
} from '../utils/market-actions';
import { MarketShareBottomSheet } from './market-share-bottom-sheet';

type MarketOverviewActionsProps = Readonly<{
  businessHours: BusinessHourTypes[];
  isOpenNow: boolean;
  marketName: string;
  marketPhone: string;
  shareUrl: string;
}>;

export const MarketOverviewActions = ({
  businessHours,
  isOpenNow,
  marketName,
  marketPhone,
  shareUrl,
}: MarketOverviewActionsProps) => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const callModalDescription = getCallModalDescription({
    closeTime: getCurrentBusinessCloseTime(businessHours),
    isOpenNow,
  });
  const telHref = getTelHref(marketPhone);

  const handleConfirmCall = () => {
    window.location.href = telHref;
    setIsCallModalOpen(false);
  };

  return (
    <>
      <div className={S.actionRowClassName}>
        <MarketShareBottomSheet
          marketName={marketName}
          shareUrl={shareUrl}
          triggerClassName={S.shareTriggerClassName}
          triggerLabel='공유하기'
        />
        <button
          className={S.primaryActionButtonClassName}
          onClick={() => setIsCallModalOpen(true)}
          type='button'
        >
          전화걸기
        </button>
      </div>

      <MobileModal
        confirmLabel='전화걸기'
        description={callModalDescription}
        onConfirm={handleConfirmCall}
        onOpenChange={setIsCallModalOpen}
        open={isCallModalOpen}
        subText={marketPhone}
        title={`${marketName}에 전화할까요?`}
      />
    </>
  );
};
