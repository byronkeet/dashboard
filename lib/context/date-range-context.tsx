"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";
import { startOfMonth, endOfMonth, subMonths, parseISO } from "date-fns";

interface DateRange {
	from: Date;
	to: Date;
}

interface DateRangeContextType {
	currentPeriod: DateRange;
	comparablePeriod: DateRange;
	setCurrentPeriod: (range: DateRange) => void;
	setComparablePeriod: (range: DateRange) => void;
	onDateRangeChange: (current: DateRange, comparable: DateRange) => void;
}

const COOKIE_NAME = "dateRanges";

const getDefaultDates = () => {
	if (typeof window === "undefined") {
		// Return stable dates for SSR
		return {
			currentMonth: {
				from: parseISO("2024-01-01"),
				to: parseISO("2024-01-31"),
			},
			lastMonth: {
				from: parseISO("2023-12-01"),
				to: parseISO("2023-12-31"),
			},
		};
	}

	const today = new Date();
	const currentMonth = {
		from: startOfMonth(today),
		to: endOfMonth(today),
	};

	const lastMonth = {
		from: startOfMonth(subMonths(today, 1)),
		to: endOfMonth(subMonths(today, 1)),
	};

	return { currentMonth, lastMonth };
};

const DateRangeContext = createContext<DateRangeContextType | undefined>(
	undefined
);

export function DateRangeProvider({ children }: { children: ReactNode }) {
	const [mounted, setMounted] = useState(false);
	const defaultDates = getDefaultDates();

	const [currentPeriod, setCurrentPeriod] = useState<DateRange>(
		defaultDates.currentMonth
	);
	const [comparablePeriod, setComparablePeriod] = useState<DateRange>(
		defaultDates.lastMonth
	);

	useEffect(() => {
		setMounted(true);
		const savedRanges = localStorage.getItem(COOKIE_NAME);
		if (savedRanges) {
			const { current, comparable } = JSON.parse(savedRanges);
			setCurrentPeriod({
				from: new Date(current.from),
				to: new Date(current.to),
			});
			setComparablePeriod({
				from: new Date(comparable.from),
				to: new Date(comparable.to),
			});
		} else {
			// Only set default dates on client if no saved dates
			const { currentMonth, lastMonth } = getDefaultDates();
			setCurrentPeriod(currentMonth);
			setComparablePeriod(lastMonth);
		}
	}, []);

	useEffect(() => {
		if (mounted) {
			localStorage.setItem(
				COOKIE_NAME,
				JSON.stringify({
					current: {
						from: currentPeriod.from.toISOString(),
						to: currentPeriod.to.toISOString(),
					},
					comparable: {
						from: comparablePeriod.from.toISOString(),
						to: comparablePeriod.to.toISOString(),
					},
				})
			);
		}
	}, [currentPeriod, comparablePeriod, mounted]);

	const onDateRangeChange = (current: DateRange, comparable: DateRange) => {
		setCurrentPeriod(current);
		setComparablePeriod(comparable);
	};

	const value = {
		currentPeriod,
		comparablePeriod,
		setCurrentPeriod,
		setComparablePeriod,
		onDateRangeChange,
	};

	return (
		<DateRangeContext.Provider value={value}>
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
