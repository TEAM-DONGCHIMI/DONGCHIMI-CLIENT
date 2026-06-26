import type { ButtonHTMLAttributes } from 'react';

import { button, size as sizeClass, tone } from './button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Is this button showing pending work? */
  loading?: boolean;
  /** Is this button showing an error state? */
  error?: boolean;
  /** Is this button showing an invalid state? */
  invalid?: boolean;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  loading = false,
  error = false,
  invalid = false,
  disabled = false,
  type = 'button',
  className,
  style,
  ...props
}: ButtonProps) => {
  const variant = primary ? 'primary' : 'secondary';
  const state = error ? 'error' : invalid ? 'invalid' : loading ? 'loading' : undefined;
  const buttonStyle = backgroundColor === undefined ? style : { ...style, backgroundColor };

  return (
    <button
      type={type}
      aria-busy={loading || undefined}
      className={[button, sizeClass[size], tone[variant], className].filter(Boolean).join(' ')}
      data-state={state}
      disabled={disabled || loading}
      style={buttonStyle}
      {...props}
    >
      {label}
    </button>
  );
};
