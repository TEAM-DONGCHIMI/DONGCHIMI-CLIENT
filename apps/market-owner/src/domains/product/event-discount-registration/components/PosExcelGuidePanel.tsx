import { IcClose } from '@dongchimi/design-system/icons';

import { usePosGuideModalBehavior } from '../hooks/usePosGuideModalBehavior';
import * as S from './PosExcelGuidePanel.css';

export interface PosExcelGuidePanelProps {
  onClose: () => void;
  open: boolean;
}

const POS_GUIDE_TITLE_ID = 'pos-excel-guide-title';

export const PosExcelGuidePanel = ({ open, onClose }: PosExcelGuidePanelProps) => {
  const { dialogRef, initialFocusRef, overlayRef } = usePosGuideModalBehavior({ open, onClose });

  if (!open) {
    return null;
  }

  return (
    <div className={S.overlayClassName} ref={overlayRef}>
      <div
        aria-labelledby={POS_GUIDE_TITLE_ID}
        aria-modal='true'
        className={S.panelClassName}
        ref={dialogRef}
        role='dialog'
        tabIndex={-1}
      >
        <button
          aria-label='POS 안내 닫기'
          className={S.closeButtonClassName}
          onClick={onClose}
          ref={initialFocusRef}
          type='button'
        >
          <IcClose aria-hidden='true' />
        </button>

        <div className={S.contentClassName}>
          <h2 className={S.titleClassName} id={POS_GUIDE_TITLE_ID}>
            {'POS에서 엑셀 파일을\n이렇게 다운 받으시면 돼요.'}
          </h2>

          <div className={S.imageListClassName}>
            <span
              aria-label='POS에서 엑셀 파일 다운로드: 상품관리 또는 판매관리 화면에서 엑셀/CSV 추출 메뉴를 선택해주세요.'
              className={[
                S.guideImagePlaceholderClassName,
                S.guideImagePlaceholderHeightClassNames.large,
              ].join(' ')}
              role='img'
            />
            <span
              aria-label='CSV 또는 엑셀 파일 저장: 다운로드한 파일을 .xlsx 또는 .csv 형식으로 저장해주세요.'
              className={[
                S.guideImagePlaceholderClassName,
                S.guideImagePlaceholderHeightClassNames.medium,
              ].join(' ')}
              role='img'
            />
            <span
              aria-label='동치미에 파일 업로드: 저장한 파일을 행사 할인 상품 등록 홈에서 업로드해주세요.'
              className={[
                S.guideImagePlaceholderClassName,
                S.guideImagePlaceholderHeightClassNames.small,
              ].join(' ')}
              role='img'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
