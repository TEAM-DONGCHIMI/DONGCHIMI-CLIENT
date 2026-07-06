import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcChevronDownSizeSmallColor50 = (
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
      fill='var(--fill-0, #8B95A1)'
      d='M2.178 5.161a.65.65 0 0 1 .858 0L8 9.67l4.964-4.509a.65.65 0 0 1 .858 0 .516.516 0 0 1 0 .78L8.43 10.839a.65.65 0 0 1-.858 0L2.178 5.94a.516.516 0 0 1 0-.78'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcChevronDownSizeSmallColor50);
const Memo = memo(ForwardRef);
export default Memo;
