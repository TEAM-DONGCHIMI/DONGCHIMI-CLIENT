import Image from 'next/image';

import { Chip } from '@dongchimi/design-system';
import { IcCalendar, IcLocation, IcPhone } from '@dongchimi/design-system/icons';

import { MarketShareBottomSheet } from '../components/market-share-bottom-sheet';
import type { BusinessDayTypes, BusinessHourTypes } from '../fixtures/market-products.fixture';
import * as S from '../MarketProductsPage.css';

const DAY_LABELS: Record<BusinessDayTypes, string> = {
  FRIDAY: '금',
  MONDAY: '월',
  SATURDAY: '토',
  SUNDAY: '일',
  THURSDAY: '목',
  TUESDAY: '화',
  WEDNESDAY: '수',
};

interface MarketOverviewSectionProps {
  market: {
    address: string;
    businessHours: BusinessHourTypes[];
    isOpenNow: boolean;
    marketPhone1: string;
    name: string;
    thumbnailUrl: string | null;
  };
  onOpenCallModal: () => void;
  shareUrl: string;
}

const formatBusinessDays = (days: BusinessDayTypes[]) => {
  if (days.length === 0) {
    return '';
  }

  if (days.length === 1) {
    return `${DAY_LABELS[days[0]]}요일`;
  }

  return `${DAY_LABELS[days[0]]}-${DAY_LABELS[days[days.length - 1]]}`;
};

const formatBusinessHour = (businessHour: BusinessHourTypes) => {
  const dayText = formatBusinessDays(businessHour.days);

  if (!businessHour.isOpen) {
    return {
      dayText,
      isClosed: true,
    };
  }

  return {
    dayText,
    isClosed: false,
    timeText: `${businessHour.open} - ${businessHour.close}`,
  };
};

export const MarketOverviewSection = ({
  market,
  onOpenCallModal,
  shareUrl,
}: MarketOverviewSectionProps) => {
  const businessHourTexts = market.businessHours.map(formatBusinessHour);

  return (
    <section aria-labelledby='market-overview-title' className={S.overviewClassName}>
      <div className={S.marketTitleRowClassName}>
        <h2 className={S.marketTitleClassName} id='market-overview-title'>
          {market.name}
        </h2>
        <Chip className={S.marketStatusChipClassName} color='primary' size='mobile' variant='soft'>
          {market.isOpenNow ? '영업중' : '영업 종료'}
        </Chip>
      </div>

      <div className={S.marketInfoClassName}>
        <div className={S.marketImageFrameClassName}>
          {market.thumbnailUrl != null ? (
            <Image
              alt={`${market.name} 대표 이미지`}
              fill
              sizes='14rem'
              src={market.thumbnailUrl}
              unoptimized
            />
          ) : (
            <span aria-hidden='true' className={S.imageFallbackClassName} />
          )}
        </div>

        <dl className={S.marketMetaListClassName}>
          <div className={S.marketMetaItemClassName}>
            <dt className={S.marketMetaIconClassName}>
              <IcLocation aria-hidden='true' />
              <span className={S.visuallyHiddenClassName}>주소</span>
            </dt>
            <dd className={S.marketMetaTextClassName}>{market.address}</dd>
          </div>
          <div className={S.marketMetaItemClassName}>
            <dt className={S.marketMetaIconClassName}>
              <IcPhone aria-hidden='true' />
              <span className={S.visuallyHiddenClassName}>전화번호</span>
            </dt>
            <dd className={S.marketMetaTextClassName}>{market.marketPhone1}</dd>
          </div>
          <div className={S.marketMetaItemClassName}>
            <dt className={S.marketMetaIconClassName}>
              <IcCalendar aria-hidden='true' />
              <span className={S.visuallyHiddenClassName}>영업시간</span>
            </dt>
            <dd className={S.businessHourLinesClassName}>
              {businessHourTexts.map((businessHour) =>
                businessHour.isClosed ? (
                  <span key={businessHour.dayText} className={S.closedBusinessHourClassName}>
                    <span className={S.closedDayClassName}>휴무</span>
                    <span>{businessHour.dayText}</span>
                  </span>
                ) : (
                  <span
                    key={`${businessHour.dayText} ${businessHour.timeText}`}
                    className={S.openBusinessHourClassName}
                  >
                    <span>{businessHour.dayText}</span>
                    <span>{businessHour.timeText}</span>
                  </span>
                ),
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className={S.actionRowClassName}>
        <MarketShareBottomSheet
          marketName={market.name}
          shareUrl={shareUrl}
          triggerClassName={S.shareTriggerClassName}
          triggerLabel='공유하기'
        />
        <button className={S.primaryActionButtonClassName} onClick={onOpenCallModal} type='button'>
          전화걸기
        </button>
      </div>
    </section>
  );
};
