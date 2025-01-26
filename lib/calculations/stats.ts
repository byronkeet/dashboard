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

export function calculateOTSStats(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): StatCalculation {
	if (!data) {
		return { value: "0", change: "0%" };
	}

	// Calculate current period average
	const currentScores = data.currentPeriod
		.map((review) => Number(review["Overall Trip Experience"]))
		.filter((score) => !isNaN(score));

	const currentAverage =
		currentScores.length > 0
			? currentScores.reduce((sum, score) => sum + score, 0) /
			  currentScores.length
			: 0;

	// Calculate previous period average
	const previousScores = data.previousPeriod
		.map((review) => Number(review["Overall Trip Experience"]))
		.filter((score) => !isNaN(score));

	const previousAverage =
		previousScores.length > 0
			? previousScores.reduce((sum, score) => sum + score, 0) /
			  previousScores.length
			: 0;

	// Calculate percentage change
	const percentageChange = calculatePercentageChange(
		previousAverage,
		currentAverage
	);

	return {
		value: `${(currentAverage * 10).toFixed(0)}%`, // Convert to percentage
		change: formatPercentageChange(percentageChange),
	};
}

export function calculateWRSStats(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): StatCalculation {
	if (!data) {
		return { value: "0", change: "0%" };
	}

	// Calculate current period WRS
	const currentRecommends = data.currentPeriod.filter(
		(review) =>
			review["Would you recommend Tuludi to your friends?"] === true
	).length;
	const currentTotal = data.currentPeriod.length;
	const currentWRS =
		currentTotal > 0 ? (currentRecommends / currentTotal) * 100 : 0;

	// Calculate previous period WRS
	const previousRecommends = data.previousPeriod.filter(
		(review) =>
			review["Would you recommend Tuludi to your friends?"] === true
	).length;
	const previousTotal = data.previousPeriod.length;
	const previousWRS =
		previousTotal > 0 ? (previousRecommends / previousTotal) * 100 : 0;

	// Calculate percentage change
	const percentageChange = calculatePercentageChange(previousWRS, currentWRS);

	return {
		value: `${currentWRS.toFixed(0)}%`,
		change: formatPercentageChange(percentageChange),
	};
}

export function calculateWESStats(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): StatCalculation {
	if (!data) {
		return { value: "0", change: "0%" };
	}

	// Calculate current period average
	const currentScores = data.currentPeriod
		.map((review) => Number(review["Overall Wildlife Experience"]))
		.filter((score) => !isNaN(score));

	const currentAverage =
		currentScores.length > 0
			? currentScores.reduce((sum, score) => sum + score, 0) /
			  currentScores.length
			: 0;

	// Calculate previous period average
	const previousScores = data.previousPeriod
		.map((review) => Number(review["Overall Wildlife Experience"]))
		.filter((score) => !isNaN(score));

	const previousAverage =
		previousScores.length > 0
			? previousScores.reduce((sum, score) => sum + score, 0) /
			  previousScores.length
			: 0;

	// Calculate percentage change
	const percentageChange = calculatePercentageChange(
		previousAverage,
		currentAverage
	);

	return {
		value: `${(currentAverage * 10).toFixed(0)}%`, // Convert to percentage
		change: formatPercentageChange(percentageChange),
	};
}
