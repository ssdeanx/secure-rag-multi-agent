
import type { JSX, SVGProps } from 'react';

export function DeanMachinesLogo(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>DeanMachines Logo</title>

      {/* Abstract 'D' shape */}
      <path
        d="M8 4H12C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20H8V4Z"
        fill="url(#logo-gradient)"
      />
      {/* Abstract 'M' shape cutout */}
      <path
        d="M12 8L12 16L15 12L12 8Z"
        fill="oklch(var(--color-background))"
      />
      <path
        d="M8 8V16H11L8 12V8Z"
        fill="oklch(var(--color-background))"
      />
    </svg>
  );
}
