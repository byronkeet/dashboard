"use client";

import { Navigation } from '@/components/layout/navigation';
import { DateRangeProvider } from '@/lib/context/date-range-context';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DateRangeProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Navigation />

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 pb-16 md:pb-0 md:ml-16">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="px-4 md:px-8">
                <img
                  src="https://www.tripmate.co.za/logo1.png"
                  alt="Trip Mate"
                  className="h-6 md:h-8 w-auto"
                />
              </div>
            </div>
          </header>
          <main className="min-h-[calc(100vh-3.5rem-4rem)] md:min-h-[calc(100vh-3.5rem)]">
            {children}
          </main>
        </div>
      </div>
    </DateRangeProvider>
  );
}