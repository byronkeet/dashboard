"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { startOfMonth, endOfToday, subMonths } from "date-fns";

interface DateRange {
	from: Date;
	to: Date;
}

interface DateRangeContextType {
	currentPeriod: DateRange;
	comparablePeriod: DateRange;
	setCurrentPeriod: (range: DateRange) => void;
	setComparablePeriod: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(
	undefined
);

export function DateRangeProvider({ children }: { children: ReactNode }) {
	// Initialize with current month to date
	const [currentPeriod, setCurrentPeriod] = useState<DateRange>({
		from: startOfMonth(new Date()), // First day of current month
		to: endOfToday(), // Current date
	});

	// Initialize comparable period with previous month
	const [comparablePeriod, setComparablePeriod] = useState<DateRange>({
		from: startOfMonth(subMonths(new Date(), 1)),
		to: endOfToday(),
	});

	return (
		<DateRangeContext.Provider
			value={{
				currentPeriod,
				comparablePeriod,
				setCurrentPeriod,
				setComparablePeriod,
			}}
		>
			{children}
		</DateRangeContext.Provider>
	);
}

export function useDateRange() {
	const context = useContext(DateRangeContext);
	if (context === undefined) {
		throw new Error("useDateRange must be used within a DateRangeProvider");
	}
	return context;
}
