"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { addMonths, subMonths } from 'date-fns';

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeContextType {
  dateRange: DateRange;
  previousDateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  // Calculate the previous period based on the current range
  const previousDateRange = {
    from: subMonths(dateRange.from, 1),
    to: subMonths(dateRange.to, 1),
  };

  return (
    <DateRangeContext.Provider value={{ dateRange, previousDateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
}