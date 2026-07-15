import { type ComponentPropsWithoutRef, useId } from 'react';

import { IcCopySizeSmall, IcLoginSizeSmall } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import * as S from './LeafletShareCard.css';

type NativeSectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children'>;

export interface LeafletShareCardProps extends NativeSectionProps {
  copyLabel?: string;
  description?: string;
  disabled?: boolean;
  onCopyLink: () => void;
  onOpenQrCode: () => void;
  qrLabel?: string;
  shareUrl: string;
  title?: string;
}

const DEFAULT_TITLE = '전단 공유하기';
const DEFAULT_DESCRIPTION = '카카오톡·문자로 공유하거나 마트에 QR을 붙여보세요.';
const DEFAULT_COPY_LABEL = '링크 복사';
const DEFAULT_QR_LABEL = '매장 고유 QR코드 보기';

export const LeafletShareCard = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledByProp,
  className,
  copyLabel = DEFAULT_COPY_LABEL,
  description = DEFAULT_DESCRIPTION,
  disabled = false,
  id,
  onCopyLink,
  onOpenQrCode,
  qrLabel = DEFAULT_QR_LABEL,
  shareUrl,
  title = DEFAULT_TITLE,
  ...props
}: LeafletShareCardProps) => {
  const generatedId = useId();
  const headingId = id ? `${id}-title` : `${generatedId}-title`;
  const ariaLabelledBy = ariaLabelledByProp ?? (ariaLabel ? undefined : headingId);

  return (
    <section
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(S.rootClassName, className)}
      id={id}
      {...props}
    >
      <header className={S.headerClassName}>
        <h2 className={S.titleClassName} id={headingId}>
          {title}
        </h2>
        <p className={S.descriptionClassName}>{description}</p>
      </header>

      <div className={S.linkContainerClassName}>
        <div className={S.linkFieldClassName}>
          <span className={S.shareUrlClassName}>{shareUrl}</span>
          <button
            aria-label='전단 공유 링크 복사'
            className={S.linkCopyButtonClassName}
            disabled={disabled}
            onClick={onCopyLink}
            type='button'
          >
            <IcCopySizeSmall aria-hidden='true' />
          </button>
        </div>
      </div>

      <ul className={S.actionListClassName}>
        <li>
          <button
            className={S.actionButtonClassName}
            disabled={disabled}
            onClick={onCopyLink}
            type='button'
          >
            <span aria-hidden='true' className={S.actionIconClassName}>
              <IcCopySizeSmall />
            </span>
            <span>{copyLabel}</span>
          </button>
        </li>
        <li>
          <button
            className={S.actionButtonClassName}
            disabled={disabled}
            onClick={onOpenQrCode}
            type='button'
          >
            <span aria-hidden='true' className={S.actionIconClassName}>
              <IcLoginSizeSmall />
            </span>
            <span>{qrLabel}</span>
          </button>
        </li>
      </ul>
    </section>
  );
};
