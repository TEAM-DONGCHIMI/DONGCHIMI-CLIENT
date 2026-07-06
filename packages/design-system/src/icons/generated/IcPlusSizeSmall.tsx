import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcPlusSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 20 20'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='var(--fill-0, #191F28)'
      d='M10 2.5c.419 0 .758.34.758.758v5.984h5.984a.758.758 0 0 1 0 1.516h-5.984v5.984a.758.758 0 0 1-1.516 0v-5.984H3.258a.758.758 0 1 1 0-1.516h5.984V3.258c0-.418.34-.758.758-.758'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcPlusSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
