import Image from 'next/image';

import { IcCalendar, IcLocation, IcPhone } from '@dongchimi/design-system/icons';

import { MarketOverviewActions } from '../components/MarketOverviewActions';
import { MarketStatusChip } from '../components/MarketStatusChip';
import * as S from '../MarketProductsPage.css';
import type {
  BusinessDayTypes,
  BusinessHourTypes,
  MarketDetailTypes,
} from '../../model/market-detail-schema';

const DAY_LABELS: Partial<Record<BusinessDayTypes, string>> = {
  FRIDAY: '금',
  MONDAY: '월',
  SATURDAY: '토',
  SUNDAY: '일',
  THURSDAY: '목',
  TUESDAY: '화',
  WEDNESDAY: '수',
};

const BUSINESS_DAY_ORDER = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] satisfies BusinessDayTypes[];

const BUSINESS_DAY_INDEX = new Map(
  BUSINESS_DAY_ORDER.map((businessDay, index) => [businessDay, index]),
);

const getBusinessDaySortIndex = (businessDay: BusinessDayTypes) => {
  return BUSINESS_DAY_INDEX.get(businessDay) ?? Number.MAX_SAFE_INTEGER;
};

const getBusinessDayLabel = (businessDay: BusinessDayTypes) => {
  return DAY_LABELS[businessDay] ?? businessDay;
};

interface MarketOverviewSectionProps {
  market: MarketDetailTypes;
  shareUrl: string;
}

const sortBusinessDays = (days: readonly BusinessDayTypes[]) => {
  return Array.from(new Set(days)).sort((previousDay, nextDay) => {
    const previousDayIndex = getBusinessDaySortIndex(previousDay);
    const nextDayIndex = getBusinessDaySortIndex(nextDay);

    return previousDayIndex === nextDayIndex
      ? previousDay.localeCompare(nextDay)
      : previousDayIndex - nextDayIndex;
  });
};

const groupContinuousBusinessDays = (days: readonly BusinessDayTypes[]) => {
  const sortedDays = sortBusinessDays(days);

  return sortedDays.reduce<BusinessDayTypes[][]>((groups, day) => {
    const previousGroup = groups[groups.length - 1];
    const previousDay = previousGroup?.[previousGroup.length - 1];
    const previousDayIndex = previousDay == null ? undefined : BUSINESS_DAY_INDEX.get(previousDay);
    const currentDayIndex = BUSINESS_DAY_INDEX.get(day);
    const isContinuous =
      previousDayIndex != null &&
      currentDayIndex != null &&
      currentDayIndex === previousDayIndex + 1;

    if (previousGroup != null && isContinuous) {
      previousGroup.push(day);
      return groups;
    }

    return [...groups, [day]];
  }, []);
};

const formatBusinessDayGroup = (days: readonly BusinessDayTypes[]) => {
  const firstDay = days[0];
  const lastDay = days[days.length - 1];

  if (firstDay == null || lastDay == null) {
    return '';
  }

  if (days.length === 1) {
    const dayLabel = DAY_LABELS[firstDay];

    return dayLabel == null ? getBusinessDayLabel(firstDay) : `${dayLabel}요일`;
  }

  return `${getBusinessDayLabel(firstDay)}-${getBusinessDayLabel(lastDay)}`;
};

export const formatBusinessDays = (days: readonly BusinessDayTypes[]) => {
  if (days.length === 0) {
    return '';
  }

  return groupContinuousBusinessDays(days).map(formatBusinessDayGroup).join(', ');
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
