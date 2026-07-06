import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcDownload = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <g fill='currentColor'>
      <path d='M12 3c.489 0 .885.413.885.922v9.554L15.8 10.44a.86.86 0 0 1 1.252 0 .95.95 0 0 1 0 1.304l-4.426 4.609a.86.86 0 0 1-1.252 0l-4.426-4.61a.95.95 0 0 1 0-1.303.86.86 0 0 1 1.252 0l2.915 3.036V3.922c0-.51.396-.922.885-.922' />
      <path d='M21 15.598c0-.509-.396-.921-.885-.921-.49 0-.885.412-.885.921v2.612c0 .835-.011 1.033-.053 1.168a1.1 1.1 0 0 1-.695.723c-.13.044-.32.055-1.121.055H6.639c-.8 0-.992-.011-1.12-.055a1.1 1.1 0 0 1-.696-.723c-.042-.135-.052-.333-.052-1.168v-2.612c0-.509-.397-.921-.886-.921S3 15.089 3 15.598v2.239c0 .543 0 1.005.03 1.384.031.399.1.787.28 1.157.274.56.71 1.014 1.247 1.298.356.19.729.26 1.112.293.364.031.808.031 1.329.031h10.004c.521 0 .965 0 1.33-.031.382-.033.755-.104 1.11-.293.537-.284.974-.739 1.247-1.298.181-.37.25-.758.281-1.157.03-.38.03-.841.03-1.384z' />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcDownload);
const Memo = memo(ForwardRef);
export default Memo;
