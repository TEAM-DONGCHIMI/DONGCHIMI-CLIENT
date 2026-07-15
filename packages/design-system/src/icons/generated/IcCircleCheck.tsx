import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCircleCheck = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      <path d='M16.694 9.854a.91.91 0 0 0-1.307-1.264l-4.723 4.88-2.05-2.124a.909.909 0 1 0-1.308 1.262l2.703 2.801a.91.91 0 0 0 1.307.001z' />
      <path
        fillRule='evenodd'
        d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M3.818 12a8.182 8.182 0 1 1 16.364 0 8.182 8.182 0 0 1-16.364 0'
        clipRule='evenodd'
      />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcCircleCheck);
const Memo = memo(ForwardRef);
export default Memo;
