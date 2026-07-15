import Image from 'next/image';

import { IcCalendar, IcLocation, IcPhone } from '@dongchimi/design-system/icons';
import { formatBusinessHour } from '@dongchimi/shared';

import { MarketOverviewActions } from '../components/MarketOverviewActions';
import { MarketStatusChip } from '../components/MarketStatusChip';
import type { BusinessHourTypes } from '../fixtures/market-products.fixture';
import * as S from '../MarketProductsPage.css';

interface MarketOverviewSectionProps {
  market: {
    address: string;
    businessHours: BusinessHourTypes[];
    isOpenNow: boolean;
    marketPhone1: string;
    name: string;
    thumbnailUrl: string | null;
  };
  shareUrl: string;
}

export const MarketOverviewSection = ({ market, shareUrl }: MarketOverviewSectionProps) => {
  const businessHourTexts = market.businessHours.map(formatBusinessHour);

  return (
    <section aria-labelledby='market-overview-title' className={S.overviewClassName}>
      <div className={S.marketTitleRowClassName}>
        <h2 className={S.marketTitleClassName} id='market-overview-title'>
          {market.name}
        </h2>
        <MarketStatusChip isOpenNow={market.isOpenNow} />
      </div>

      <div className={S.marketInfoClassName}>
        <div className={S.marketImageFrameClassName}>
          {market.thumbnailUrl != null ? (
            <Image
              alt={`${market.name} 대표 이미지`}
              fill
              sizes='14.1rem'
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

      <MarketOverviewActions
        businessHours={market.businessHours}
        isOpenNow={market.isOpenNow}
        marketName={market.name}
        marketPhone={market.marketPhone1}
        shareUrl={shareUrl}
      />
    </section>
  );
};
