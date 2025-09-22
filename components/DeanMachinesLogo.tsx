import type { JSX, SVGProps } from 'react';

export function DeanMachinesLogo(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>DeanMachines Logo</title>
          <path
            d="M12 2L13 10L18 11L12.5 16.5L14 22L12 19L10 22L11.5 16.5L6 11L11 10L12 2Z"
            fill="var(--primary)"
            stroke="hsl(var(--primary-h) var(--primary-s) var(--primary-l) / 0.5)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
    </svg>
  );
}
