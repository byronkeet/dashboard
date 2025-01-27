import { ReviewData } from "@/lib/types";

export type MarketingSource = {
	name: string;
	value: number;
	previousValue: number;
	count: number;
	previousCount: number;
};

export function calculateMarketingSources(
	reviewData: ReviewData
): MarketingSource[] {
	if (!reviewData?.currentPeriod || !reviewData?.previousPeriod) {
		return [];
	}

	// Count current period sources
	const currentSources = reviewData.currentPeriod.reduce((acc, review) => {
		const source = review["How did you hear about Taludi?"] || "Other";
		acc[source] = (acc[source] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	// Count previous period sources
	const previousSources = reviewData.previousPeriod.reduce((acc, review) => {
		const source = review["How did you hear about Taludi?"] || "Other";
		acc[source] = (acc[source] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	// Calculate totals for percentages
	const currentTotal = Object.values(currentSources).reduce(
		(a, b) => a + b,
		0
	);
	const previousTotal = Object.values(previousSources).reduce(
		(a, b) => a + b,
		0
	);

	// Combine and format data
	const sources = [
		...new Set([
			...Object.keys(currentSources),
			...Object.keys(previousSources),
		]),
	];

	return sources
		.map((source) => ({
			name: source,
			value: ((currentSources[source] || 0) / currentTotal) * 100,
			previousValue:
				((previousSources[source] || 0) / previousTotal) * 100,
			count: currentSources[source] || 0,
			previousCount: previousSources[source] || 0,
		}))
		.sort((a, b) => b.value - a.value); // Sort by current period percentage
}
