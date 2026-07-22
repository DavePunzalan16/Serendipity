import type { ReactNode } from 'react';

/**
 * PageContainer — Standard page wrapper providing max-width and consistent padding.
 * Used as the main content area below the navbar.
 */
export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main className={`mx-auto w-full max-w-[1224px] px-6 py-8 md:px-16 lg:px-0 ${className}`}>
      {children}
    </main>
  );
}
