import { render, screen, userEvent, within } from '@/test';
import { describe, expect, it, vi } from 'vitest';

import { registrationMethodFixture } from '../fixtures';
import { PosExcelGuidePanel } from './PosExcelGuidePanel';

const defaultProps = {
  onClose: vi.fn(),
  open: true,
  posGuide: registrationMethodFixture.posGuide,
};

const renderPosExcelGuidePanel = (
  props: Partial<Parameters<typeof PosExcelGuidePanel>[0]> = {},
) => {
  return render(<PosExcelGuidePanel {...defaultProps} {...props} />);
};

describe('PosExcelGuidePanel', () => {
  it('does not render when closed', () => {
    renderPosExcelGuidePanel({ open: false });

    expect(screen.queryByRole('dialog', { name: 'POS 엑셀 다운로드 안내' })).toBeNull();
  });

  it('renders POS guide steps as a modal dialog when open', () => {
    renderPosExcelGuidePanel();

    const panel = screen.getByRole('dialog', { name: 'POS 엑셀 다운로드 안내' });

    expect(panel).toHaveAttribute('aria-modal', 'true');

    const steps = within(panel).getAllByRole('listitem');

    expect(
      within(panel).getByRole('heading', { name: registrationMethodFixture.posGuide.title }),
    ).toBeInTheDocument();
    expect(steps).toHaveLength(registrationMethodFixture.posGuide.steps.length);
    registrationMethodFixture.posGuide.steps.forEach((step) => {
      expect(within(panel).getByText(step.title)).toBeInTheDocument();
      expect(within(panel).getByText(step.description)).toBeInTheDocument();
    });
  });

  it('moves focus to the close button when opened', () => {
    renderPosExcelGuidePanel();

    expect(screen.getByRole('button', { name: 'POS 안내 닫기' })).toHaveFocus();
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
