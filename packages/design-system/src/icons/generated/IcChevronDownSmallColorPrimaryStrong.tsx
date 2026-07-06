import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcChevronDownSmallColorPrimaryStrong = (
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
    viewBox='0 0 24 24'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='var(--fill-0, #028450)'
      d='M4.267 8.27a.905.905 0 0 1 1.289 0L12 14.778l6.444-6.508a.905.905 0 0 1 1.29 0 .927.927 0 0 1 0 1.301l-7.09 7.16a.905.905 0 0 1-1.289 0L4.267 9.57a.927.927 0 0 1 0-1.301'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcChevronDownSmallColorPrimaryStrong);
const Memo = memo(ForwardRef);
export default Memo;
