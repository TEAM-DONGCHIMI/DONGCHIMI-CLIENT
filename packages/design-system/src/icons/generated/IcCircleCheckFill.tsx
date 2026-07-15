import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCircleCheckFill = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 24 24'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='var(--fill-0, #15C47E)'
      fillRule='evenodd'
      d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m14.694-2.146a.909.909 0 1 0-1.307-1.264l-4.723 4.88-2.05-2.124a.909.909 0 1 0-1.308 1.262l2.703 2.801a.91.91 0 0 0 1.307 0z'
      clipRule='evenodd'
    />
    <path
      fill='var(--fill-0, white)'
      d='M16.694 9.855a.909.909 0 1 0-1.306-1.265l-4.724 4.88-2.05-2.124a.909.909 0 1 0-1.308 1.262l2.703 2.801a.91.91 0 0 0 1.308.001z'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCircleCheckFill);
const Memo = memo(ForwardRef);
export default Memo;
