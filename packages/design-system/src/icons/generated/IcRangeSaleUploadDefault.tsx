import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcRangeSaleUploadDefault = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='none'
    viewBox='0 0 24 24'
    ref={ref}
    {...props}
  >
    <path
      stroke='#8B95A1'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A2 2 0 0 1 3 12V7a4 4 0 0 1 4-4'
    />
    <circle cx={16.5} cy={6.5} r={5.5} fill='#00C66F' />
    <path
      fill='#fff'
      d='M16.494 2c.413 0 .748.335.748.748v2.996h3.01a.748.748 0 1 1 0 1.496h-3.01v3.012a.749.749 0 0 1-1.496 0V7.24h-2.998a.749.749 0 0 1 0-1.496h2.998V2.748c0-.413.335-.748.748-.748'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcRangeSaleUploadDefault);
const Memo = memo(ForwardRef);
export default Memo;
