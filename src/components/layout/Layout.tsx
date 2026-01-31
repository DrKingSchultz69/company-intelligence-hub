import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* CRT Overlay */}
      <div className="fixed inset-0 pointer-events-none crt-overlay z-50" />
      
      <Navigation />
      
      <main className="pt-20 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
