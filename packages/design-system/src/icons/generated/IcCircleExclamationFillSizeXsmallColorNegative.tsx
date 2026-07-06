import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCircleExclamationFillSizeXsmallColorNegative = (
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
      fillRule='evenodd'
      d='M1.333 8a6.667 6.667 0 1 1 13.334 0A6.667 6.667 0 0 1 1.333 8M8 4.7c.335 0 .606.272.606.606v3.03a.606.606 0 1 1-1.212 0v-3.03c0-.334.271-.606.606-.606m.673 5.994a.673.673 0 1 1-1.347 0 .673.673 0 0 1 1.347 0'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCircleExclamationFillSizeXsmallColorNegative);
const Memo = memo(ForwardRef);
export default Memo;
