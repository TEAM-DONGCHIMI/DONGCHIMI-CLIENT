import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcLogoKakaoSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fillRule='evenodd'
      d='M10 2C5.584 2 2 4.782 2 8.204c0 2.134 1.384 3.997 3.496 5.132l-.888 3.254a.328.328 0 0 0 .504.352L9 14.36c.328 0 .664.056 1 .056 4.416 0 8-2.783 8-6.212C18 4.774 14.416 2 10 2'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcLogoKakaoSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
