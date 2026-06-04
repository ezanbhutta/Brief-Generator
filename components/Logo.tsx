interface Props {
  size?: number;
  className?: string;
  /** Color of the bars. Defaults to currentColor so it inherits text color. */
  color?: string;
}

export default function Logo({ size = 24, className, color = "currentColor" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <g fill={color}>
        <rect x="290" y="245" width="55" height="125" rx="14" />
        <rect x="365" y="225" width="55" height="155" rx="14" />
        <rect x="440" y="265" width="55" height="105" rx="14" />
        <rect x="290" y="395" width="55" height="105" rx="14" />
        <rect x="365" y="395" width="55" height="155" rx="14" />
        <rect x="440" y="395" width="55" height="125" rx="14" />
      </g>
    </svg>
  );
}
