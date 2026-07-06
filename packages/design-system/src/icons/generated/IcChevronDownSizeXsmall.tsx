import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcChevronDownSizeXsmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 12 12'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='var(--fill-0, #191F28)'
      d='M1.148 4.134a.54.54 0 0 1 .715 0L6 7.891l4.137-3.757a.54.54 0 0 1 .715 0 .43.43 0 0 1 0 .65L6.358 8.866a.54.54 0 0 1-.716 0L1.148 4.784a.43.43 0 0 1 0-.65'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcChevronDownSizeXsmall);
const Memo = memo(ForwardRef);
export default Memo;
