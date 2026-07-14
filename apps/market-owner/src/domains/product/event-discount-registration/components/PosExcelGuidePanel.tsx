import { IcClose } from '@dongchimi/design-system/icons';

import { usePosGuideModalBehavior } from '../hooks/usePosGuideModalBehavior';
import * as S from './PosExcelGuidePanel.css';

export interface PosExcelGuidePanelProps {
  onClose: () => void;
  open: boolean;
}

const POS_GUIDE_TITLE_ID = 'pos-excel-guide-title';
const POS_EXCEL_GUIDE_ALT =
  'POS 엑셀 상품 등록 안내: 1. 상품관리 또는 상품목록 메뉴에서 CSV 내보내기나 엑셀 다운로드를 선택합니다. 2. 동치미 엑셀 양식의 첫 번째 행은 수정하지 않고 상품명, 판매가, 할인 기간을 필수로 입력하며 홍보 문구는 선택으로 입력합니다. 3. 작성한 파일을 CSV 또는 Excel 형식으로 저장해 동치미에 업로드합니다.';

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

          <img
            alt={POS_EXCEL_GUIDE_ALT}
            className={S.guideImageClassName}
            height={722}
            src='/images/pos-excel-guide.webp'
            width={360}
          />
        </div>
      </div>
    </div>
  );
};
