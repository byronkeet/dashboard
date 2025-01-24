import { DateRange } from '@/lib/types';
import { format } from 'date-fns';

// Helper function to format dates for API requests
const formatDateParam = (date: Date) => format(date, 'yyyy-MM-dd');

export async function fetchData<T>(
  endpoint: string,
  dateRange: DateRange,
  includePrevious: boolean = true
): Promise<{
  current: T;
  previous?: T;
}> {
  const params = new URLSearchParams({
    from: formatDateParam(dateRange.from),
    to: formatDateParam(dateRange.to),
  });

  const currentResponse = await fetch(`/api/${endpoint}?${params}`);
  const currentData = await currentResponse.json();

  if (!includePrevious) {
    return { current: currentData };
  }

  // Calculate previous period
  const previousFrom = new Date(dateRange.from);
  const previousTo = new Date(dateRange.to);
  const monthDiff = dateRange.to.getMonth() - dateRange.from.getMonth() + 
    (12 * (dateRange.to.getFullYear() - dateRange.from.getFullYear()));
  
  previousFrom.setMonth(previousFrom.getMonth() - monthDiff);
  previousTo.setMonth(previousTo.getMonth() - monthDiff);

  const previousParams = new URLSearchParams({
    from: formatDateParam(previousFrom),
    to: formatDateParam(previousTo),
  });

  const previousResponse = await fetch(`/api/${endpoint}?${previousParams}`);
  const previousData = await previousResponse.json();

  return {
    current: currentData,
    previous: previousData,
  };
}