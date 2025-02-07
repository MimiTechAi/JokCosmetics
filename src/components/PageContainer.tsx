'use client';

import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn(
      "min-h-screen bg-gradient-to-b from-pink-50 to-white",
      "pt-24 md:pt-28", // Abstand für den Header
      className
    )}>
      {children}
    </main>
  );
}
