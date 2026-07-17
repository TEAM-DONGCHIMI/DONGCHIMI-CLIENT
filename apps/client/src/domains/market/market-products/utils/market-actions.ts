import { getCurrentBusinessCloseTime } from '@dongchimi/shared/business-hours';

import { CLIENT_ROUTES } from '@/shared/constants';

type CallModalDescriptionParamsTypes = Readonly<{
  closeTime: string | undefined;
  isOpenNow: boolean;
}>;

export { getCurrentBusinessCloseTime };

const CLIENT_APP_ORIGIN = 'https://app.dongchiimi.com';

export const getCallModalDescription = ({
  closeTime,
  isOpenNow,
}: CallModalDescriptionParamsTypes) => {
  if (!isOpenNow) {
    return '현재 영업 시간이 아니에요.';
  }

  if (closeTime == null) {
    return '현재 영업중';
  }

  return `현재 영업중· ${closeTime}까지`;
};

export const getTelHref = (phoneNumber: string) => `tel:${phoneNumber.replaceAll('-', '')}`;

export const getShareUrl = (slug: string) => `${CLIENT_APP_ORIGIN}${CLIENT_ROUTES.market(slug)}`;
