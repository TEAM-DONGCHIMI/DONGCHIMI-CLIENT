import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcLogoKakao = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='currentColor'
      fillRule='evenodd'
      d='M12.5 3C7.256 3 3 6.339 3 10.445c0 2.561 1.644 4.796 4.152 6.159l-1.055 3.904a.4.4 0 0 0 .154.421.39.39 0 0 0 .444.001l4.618-3.098c.389 0 .788.067 1.187.067 5.244 0 9.5-3.339 9.5-7.454S17.744 3 12.5 3'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcLogoKakao);
const Memo = memo(ForwardRef);
export default Memo;
