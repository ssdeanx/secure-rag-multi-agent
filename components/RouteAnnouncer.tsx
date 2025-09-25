"use client";
import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Announces route changes for screen readers & focuses main content
export default function RouteAnnouncer() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) { return; }
    const main = document.getElementById('main');
    if (main) {
      // Make focusable temporarily
      const prevTabIndex = main.getAttribute('tabindex');
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: false });
      // Cleanup
      const cleanup = () => {
        if (prevTabIndex === null) {
          main.removeAttribute('tabindex');
        } else {
          main.setAttribute('tabindex', prevTabIndex);
        }
      };
      setTimeout(cleanup, 100);
    }
    ref.current.textContent = `Page loaded: ${document.title}`;
  }, [pathname]);

  return (
    <div
      ref={ref}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
