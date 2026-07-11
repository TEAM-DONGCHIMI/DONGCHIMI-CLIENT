import { render, screen, userEvent, within } from '@/test';
import { describe, expect, it, vi } from 'vitest';

import { PosExcelGuidePanel } from './PosExcelGuidePanel';

const defaultProps = {
  onClose: vi.fn(),
  open: true,
};

const renderPosExcelGuidePanel = (
  props: Partial<Parameters<typeof PosExcelGuidePanel>[0]> = {},
) => {
  return render(<PosExcelGuidePanel {...defaultProps} {...props} />);
};

const posGuideDialogName = /POS에서 엑셀 파일을\s+이렇게 다운 받으시면 돼요\./;

describe('PosExcelGuidePanel', () => {
  it('does not render when closed', () => {
    renderPosExcelGuidePanel({ open: false });

    expect(screen.queryByRole('dialog', { name: posGuideDialogName })).toBeNull();
  });

  it('renders POS guide image placeholders as a modal dialog when open', () => {
    renderPosExcelGuidePanel();

    const panel = screen.getByRole('dialog', { name: posGuideDialogName });

    expect(panel).toHaveAttribute('aria-modal', 'true');

    expect(within(panel).getByRole('heading', { name: /POS에서 엑셀 파일을/ })).toHaveTextContent(
      'POS에서 엑셀 파일을 이렇게 다운 받으시면 돼요.',
    );
    expect(within(panel).getAllByRole('img')).toHaveLength(3);
    expect(
      within(panel).getByRole('img', {
        name: 'POS에서 엑셀 파일 다운로드: 상품관리 또는 판매관리 화면에서 엑셀/CSV 추출 메뉴를 선택해주세요.',
      }),
    ).toBeInTheDocument();
    expect(
      within(panel).getByRole('img', {
        name: 'CSV 또는 엑셀 파일 저장: 다운로드한 파일을 .xlsx 또는 .csv 형식으로 저장해주세요.',
      }),
    ).toBeInTheDocument();
    expect(
      within(panel).getByRole('img', {
        name: '동치미에 파일 업로드: 저장한 파일을 행사 할인 상품 등록 홈에서 업로드해주세요.',
      }),
    ).toBeInTheDocument();
  });

  it('moves focus to the close button when opened', () => {
    renderPosExcelGuidePanel();

    expect(screen.getByRole('button', { name: 'POS 안내 닫기' })).toHaveFocus();
  });

  it('restores focus to the previously focused element when closed', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'POS 안내 열기';
    document.body.appendChild(trigger);
    trigger.focus();

    try {
      const { rerender } = renderPosExcelGuidePanel();

      expect(screen.getByRole('button', { name: 'POS 안내 닫기' })).toHaveFocus();

      rerender(<PosExcelGuidePanel {...defaultProps} open={false} />);

      expect(trigger).toHaveFocus();
    } finally {
      trigger.remove();
    }
  });

  it('calls close callback from the close button', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderPosExcelGuidePanel({ onClose: handleClose });

    await user.click(screen.getByRole('button', { name: 'POS 안내 닫기' }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls close callback on Escape key', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderPosExcelGuidePanel({ onClose: handleClose });

    await user.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls close callback when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    const { container } = renderPosExcelGuidePanel({ onClose: handleClose });
    const overlay = container.firstElementChild as HTMLElement;

    await user.click(overlay);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
