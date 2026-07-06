import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcReset = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='var(--fill-0, #191F28)'
      d='M9.927 7.216 8.595 5.884a7.681 7.681 0 1 1-3.775 6.615.91.91 0 1 0-1.82 0 9.5 9.5 0 0 0 16.218 6.719 9.5 9.5 0 0 0 0-13.436C15.97 2.536 10.962 2.131 7.275 4.564L5.997 3.286a.91.91 0 0 0-1.553.643v3.93a.91.91 0 0 0 .91.91h3.93a.91.91 0 0 0 .643-1.553'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcReset);
const Memo = memo(ForwardRef);
export default Memo;
