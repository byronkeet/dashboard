// Helper functions for stat calculations
export function calculatePercentageChange(
	previous: number,
	current: number
): number {
	if (previous === 0) return 0;
	return ((current - previous) / previous) * 100;
}

export function formatPercentageChange(change: number): string {
	return `${change > 0 ? "+" : ""}${change.toFixed(0)}%`;
}

export interface StatCalculation {
	value: string;
	change: string;
}

export function calculateGuestStats(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): StatCalculation {
	if (!data) {
		return { value: "0", change: "0%" };
	}

	const currentTotal = data.currentPeriod.length;
	const previousTotal = data.previousPeriod.length;
	const percentageChange = calculatePercentageChange(
		previousTotal,
		currentTotal
	);

	return {
		value: currentTotal.toString(),
		change: formatPercentageChange(percentageChange),
	};
}

export function calculateSubmissionStats(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): StatCalculation {
	if (!data) {
		return { value: "0", change: "0%" };
	}

	const currentTotal = data.currentPeriod.length;
	const previousTotal = data.previousPeriod.length;
	const percentageChange = calculatePercentageChange(
		previousTotal,
		currentTotal
	);

	return {
		value: currentTotal.toString(),
		change: formatPercentageChange(percentageChange),
	};
}
