import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCirclePlus = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      <path d='M12.91 7.96a.91.91 0 1 0-1.82 0v3.13H7.96a.91.91 0 1 0 0 1.819h3.13v3.131a.91.91 0 0 0 1.82 0V12.91h3.13a.91.91 0 1 0 0-1.818h-3.13z' />
      <path
        fillRule='evenodd'
        d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M3.818 12a8.182 8.182 0 1 1 16.364 0 8.182 8.182 0 0 1-16.364 0'
        clipRule='evenodd'
      />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcCirclePlus);
const Memo = memo(ForwardRef);
export default Memo;
