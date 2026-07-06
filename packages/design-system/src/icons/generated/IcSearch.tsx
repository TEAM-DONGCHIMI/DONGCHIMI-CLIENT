import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcSearch = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='var(--fill-0, #191F28)'
      fillRule='evenodd'
      d='M9.777 2a7.777 7.777 0 1 0 4.837 13.867l4.874 4.874a.886.886 0 0 0 1.253-1.253l-4.874-4.874A7.777 7.777 0 0 0 9.777 2M3.772 9.777a6.005 6.005 0 1 1 12.01 0 6.005 6.005 0 0 1-12.01 0'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcSearch);
const Memo = memo(ForwardRef);
export default Memo;
