import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCircleExclamation = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <g fill='currentColor'>
      <path d='M13.01 16.04a1.01 1.01 0 1 1-2.02 0 1.01 1.01 0 0 1 2.02 0M12.91 7.96a.91.91 0 1 0-1.819 0v4.545a.91.91 0 0 0 1.818 0z' />
      <path
        fillRule='evenodd'
        d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m10-8.182a8.182 8.182 0 1 0 0 16.364 8.182 8.182 0 0 0 0-16.364'
        clipRule='evenodd'
      />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcCircleExclamation);
const Memo = memo(ForwardRef);
export default Memo;
