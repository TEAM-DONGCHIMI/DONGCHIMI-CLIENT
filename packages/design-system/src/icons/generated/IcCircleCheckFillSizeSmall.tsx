import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCircleCheckFillSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='var(--fill-0, #15C47E)'
      fillRule='evenodd'
      d='M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m10.286-1.502a.636.636 0 0 0-.915-.885L7.065 9.029 5.63 7.542a.636.636 0 0 0-.916.884l1.892 1.96a.636.636 0 0 0 .915.001z'
      clipRule='evenodd'
    />
    <path
      fill='var(--fill-0, white)'
      d='M11.13 6.57a.606.606 0 0 0-.872-.843L7.11 8.98 5.743 7.564a.606.606 0 0 0-.872.842l1.802 1.867a.606.606 0 0 0 .871 0z'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCircleCheckFillSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
