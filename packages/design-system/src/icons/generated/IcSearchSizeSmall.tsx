import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcSearchSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 16 16'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='var(--fill-0, #6B7684)'
      fillRule='evenodd'
      d='M6.912 2a4.912 4.912 0 1 0 3.055 8.758l3.078 3.078a.56.56 0 0 0 .791-.791l-3.078-3.078A4.912 4.912 0 0 0 6.911 2M3.119 6.912a3.793 3.793 0 1 1 7.586 0 3.793 3.793 0 0 1-7.586 0'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcSearchSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
