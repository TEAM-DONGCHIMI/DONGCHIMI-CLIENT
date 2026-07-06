import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcChevronDownSizeSmallColor70 = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
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
      fill='var(--fill-0, #4E5968)'
      d='M2.178 5.188a.583.583 0 0 1 .858 0L8 10.448l4.964-5.26a.583.583 0 0 1 .858 0 .67.67 0 0 1 0 .91L8.43 11.811a.583.583 0 0 1-.858 0L2.178 6.097a.67.67 0 0 1 0-.909'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcChevronDownSizeSmallColor70);
const Memo = memo(ForwardRef);
export default Memo;
