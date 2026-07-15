import { getCurrentBusinessCloseTime } from '@dongchimi/shared';

type CallModalDescriptionParamsTypes = Readonly<{
  closeTime: string | undefined;
  isOpenNow: boolean;
}>;

export { getCurrentBusinessCloseTime };

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

export const getShareUrl = (slug: string) => `dongchimi.kr/${slug}`;
