import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcTune = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <g fill='currentColor' fillRule='evenodd' clipRule='evenodd'>
      <path d='M12.209 8.607h-8.3a.91.91 0 0 1 0-1.823h8.3A3.69 3.69 0 0 1 15.785 4a3.69 3.69 0 0 1 3.575 2.784h1.73a.91.91 0 0 1 0 1.823h-1.73a3.69 3.69 0 0 1-3.575 2.785 3.69 3.69 0 0 1-3.576-2.785m1.706-.91c0-1.035.837-1.874 1.87-1.874 1.032 0 1.87.839 1.87 1.873a1.87 1.87 0 0 1-1.87 1.874 1.87 1.87 0 0 1-1.87-1.874M5.64 17.214H3.91a.91.91 0 0 1 0-1.823h1.73a3.69 3.69 0 0 1 3.575-2.783 3.69 3.69 0 0 1 3.576 2.783h8.3a.91.91 0 0 1 0 1.823h-8.3A3.69 3.69 0 0 1 9.215 20a3.69 3.69 0 0 1-3.576-2.786m1.706-.91c0-1.035.837-1.874 1.87-1.874 1.032 0 1.87.84 1.87 1.874a1.87 1.87 0 0 1-1.87 1.873 1.87 1.87 0 0 1-1.87-1.873' />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcTune);
const Memo = memo(ForwardRef);
export default Memo;
