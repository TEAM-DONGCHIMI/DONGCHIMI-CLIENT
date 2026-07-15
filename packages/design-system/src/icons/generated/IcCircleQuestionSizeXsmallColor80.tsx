import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCircleQuestionSizeXsmallColor80 = (
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
    <g fill='#333D4B'>
      <path d='M7.468 8.666c-.057.313.21.575.528.575s.559-.266.665-.566c.14-.395.424-.632.707-.869.392-.328.782-.654.782-1.395 0-1.148-.93-1.824-2.114-1.824-1.076 0-1.888.567-2.125 1.488-.08.309.188.572.507.572.317 0 .55-.275.698-.556.158-.303.462-.476.875-.479.567.005.961.332.961.844 0 .415-.26.613-.565.845-.358.273-.779.593-.92 1.365M7.265 10.666c-.005.408.304.707.735.707.422 0 .73-.299.735-.707-.005-.408-.313-.708-.735-.708-.431 0-.74.3-.735.708' />
      <path
        fillRule='evenodd'
        d='M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M2.68 8a5.318 5.318 0 1 1 10.637 0A5.318 5.318 0 0 1 2.68 8'
        clipRule='evenodd'
      />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcCircleQuestionSizeXsmallColor80);
const Memo = memo(ForwardRef);
export default Memo;
