'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Stack } from '@dongchimi/design-system/components';

import notFoundImage from '@/shared/assets/images/img_404.svg';
import { CLIENT_ROUTES } from '@/shared/constants';

import * as S from './NotFoundPage.css';

export const NotFoundPage = () => {
  return (
    <Stack align='center' as='main' className={S.pageClassName} gap='none'>
      <Stack
        align='center'
        aria-labelledby='not-found-title'
        as='section'
        className={S.contentClassName}
        gap='none'
      >
        <Image
          alt=''
          aria-hidden='true'
          className={S.imageClassName}
          height={200}
          priority
          src={notFoundImage}
          width={200}
        />

        <Stack align='center' className={S.messageClassName} gap='none'>
          <h1 className={S.titleClassName} id='not-found-title'>
            페이지 오류가 발생했어요.
          </h1>
          <p className={S.descriptionClassName}>홈으로 이동해 다시 시도해 주세요.</p>
        </Stack>
      </Stack>

      <Link className={S.homeLinkClassName} href={CLIENT_ROUTES.root}>
        홈으로 돌아가기
      </Link>
    </Stack>
  );
};
