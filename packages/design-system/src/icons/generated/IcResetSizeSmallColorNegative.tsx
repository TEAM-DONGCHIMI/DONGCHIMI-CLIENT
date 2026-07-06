import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcResetSizeSmallColorNegative = (
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
      fill='var(--fill-0, #FF4242)'
      d='m6.573 4.718-.912-.912a5.255 5.255 0 1 1-2.583 4.526.622.622 0 1 0-1.245 0 6.5 6.5 0 1 0 2.925-5.43l-.874-.873a.622.622 0 0 0-1.063.44v2.69a.62.62 0 0 0 .623.621h2.689a.622.622 0 0 0 .44-1.062'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcResetSizeSmallColorNegative);
const Memo = memo(ForwardRef);
export default Memo;
