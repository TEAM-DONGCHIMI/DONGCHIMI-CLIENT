import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCircleExclamationSizeSmallColorNegative = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='none'
    viewBox='0 0 16 16'
    ref={ref}
    {...props}
  >
    <path
      fill='#FF4242'
      d='M8.157 10.126a.657.657 0 1 1-1.314 0 .657.657 0 0 1 1.314 0M8.091 4.874a.59.59 0 0 0-1.182 0v2.954a.59.59 0 0 0 1.182 0z'
    />
    <path
      fill='#FF4242'
      fillRule='evenodd'
      d='M1 7.5a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0m6.5-5.318a5.318 5.318 0 1 0 0 10.636 5.318 5.318 0 0 0 0-10.636'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCircleExclamationSizeSmallColorNegative);
const Memo = memo(ForwardRef);
export default Memo;
