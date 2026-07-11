import { Box } from '@dongchimi/design-system/components';

import phoneFrameUrl from '../assets/phone-frame.svg';
import phoneStatusBarUrl from '../assets/phone-status-bar.svg';
import * as S from './PhonePreviewFrame.css';

export const PhonePreviewFrame = () => {
  return (
    <Box aria-label='모바일 전단 미리보기' as='section' className={S.previewClassName}>
      <Box aria-hidden='true' className={S.previewContentClassName} />
      <img alt='' aria-hidden='true' className={S.statusBarClassName} src={phoneStatusBarUrl} />
      <img alt='' aria-hidden='true' className={S.phoneFrameClassName} src={phoneFrameUrl} />
    </Box>
  );
};
