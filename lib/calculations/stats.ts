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

export function calculateGuideRatingStats(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): StatCalculation {
	if (!data) {
		return { value: "0", change: "0%" };
	}

	// Calculate current period average
	const currentScores = data.currentPeriod
		.map((review) => Number(review["Rate Your Guide"]))
		.filter((score) => !isNaN(score));

	const currentAverage =
		currentScores.length > 0
			? currentScores.reduce((sum, score) => sum + score, 0) /
			  currentScores.length
			: 0;

	// Calculate previous period average
	const previousScores = data.previousPeriod
		.map((review) => Number(review["Rate Your Guide"]))
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
		value: `${((currentAverage / 5) * 100).toFixed(0)}%`, // Convert to percentage (out of 5)
		change: formatPercentageChange(percentageChange),
	};
}

export interface GuideMetric {
	name: string;
	rating: number;
	previousRating: number;
	trips: number;
	previousTrips: number;
}

export function calculateGuideMetrics(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): GuideMetric[] {
	if (!data) return [];

	// Helper function to calculate metrics for a period
	const calculatePeriodMetrics = (reviews: any[]) => {
		const guideStats = reviews.reduce((acc, review) => {
			const guideName = review["Your Guide"];
			const rating = Number(review["Rate Your Guide"]) || 0;

			if (!guideName) return acc;

			if (!acc[guideName]) {
				acc[guideName] = { totalRating: 0, count: 0 };
			}

			if (rating > 0) {
				acc[guideName].totalRating += rating;
				acc[guideName].count += 1;
			}

			return acc;
		}, {} as Record<string, { totalRating: number; count: number }>);

		return Object.entries(guideStats).map(([name, stats]) => ({
			name,
			rating: stats.count > 0 ? stats.totalRating / stats.count : 0,
			trips: stats.count,
		}));
	};

	const currentMetrics = calculatePeriodMetrics(data.currentPeriod);
	const previousMetrics = calculatePeriodMetrics(data.previousPeriod);

	// Combine current and previous metrics
	return currentMetrics.map((current) => {
		const previous = previousMetrics.find(
			(p) => p.name === current.name
		) || {
			rating: 0,
			trips: 0,
		};

		return {
			name: current.name,
			rating: current.rating,
			previousRating: previous.rating,
			trips: current.trips,
			previousTrips: previous.trips,
		};
	});
}

export interface WildlifeMetric {
	name: string;
	value: number;
	previousValue: number;
}

export function calculateWildlifeSightings(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): WildlifeMetric[] {
	const calculatePeriodSightings = (reviews: any[]) => {
		const sightings = reviews.reduce((acc, review) => {
			const animals = (review["Key Sightings"] || "")
				.split(",")
				.map((animal: string) => animal.trim())
				.filter(Boolean);

			animals.forEach((animal: string) => {
				acc[animal] = (acc[animal] || 0) + 1;
			});

			return acc;
		}, {} as Record<string, number>);

		return Object.entries(sightings).map(([name, value]) => ({
			name,
			value,
		}));
	};

	const currentSightings = calculatePeriodSightings(data.currentPeriod);
	const previousSightings = calculatePeriodSightings(data.previousPeriod);

	return currentSightings
		.map((current) => {
			const previous = previousSightings.find(
				(p) => p.name === current.name
			) || { value: 0 };
			return {
				name: current.name,
				value: current.value,
				previousValue: previous.value,
			};
		})
		.sort((a, b) => b.value - a.value); // Sort by highest count
}

export interface ActivityComment {
	name: string;
	sentiment: "POSITIVE" | "NEGATIVE";
	comment: string;
}

export function calculateActivityComments(data: {
	currentPeriod: any[];
}): ActivityComment[] {
	if (!data?.currentPeriod) return [];

	return data.currentPeriod
		.filter(
			(review) =>
				review[
					"Any Further Comments or Recommendations about our wildlife experience?"
				]
		)
		.map((review) => ({
			name: review["Full Name"],
			sentiment:
				review["Wildlife Comment Sentiment"] === "Positive"
					? "POSITIVE"
					: "NEGATIVE",
			comment:
				review[
					"Any Further Comments or Recommendations about our wildlife experience?"
				],
		}));
}

export interface ActivityMetric {
	name: string;
	count: number;
	previousCount: number;
}

export function calculateActivityCounts(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): ActivityMetric[] {
	const calculatePeriodActivities = (reviews: any[]) => {
		const activities = reviews.reduce((acc, review) => {
			const activities = (review["What activities did you do?"] || "")
				.split(",")
				.map((activity: string) => activity.trim())
				.filter(Boolean);

			activities.forEach((activity: string) => {
				acc[activity] = (acc[activity] || 0) + 1;
			});

			return acc;
		}, {} as Record<string, number>);

		return Object.entries(activities).map(([name, count]) => ({
			name,
			count,
		}));
	};

	const currentActivities = calculatePeriodActivities(data.currentPeriod);
	const previousActivities = calculatePeriodActivities(data.previousPeriod);

	return currentActivities
		.map((current) => {
			const previous = previousActivities.find(
				(p) => p.name === current.name
			) || { count: 0 };
			return {
				name: current.name,
				count: current.count,
				previousCount: previous.count,
			};
		})
		.sort((a, b) => b.count - a.count); // Sort by highest count
}

export function calculateRoomRating(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): { value: string; change: string } {
	const calculateAverage = (reviews: any[]) => {
		if (!reviews?.length) return 0;
		const total = reviews.reduce((sum, review) => {
			const score = Number(review["Your Accommodation"] || 0);
			return sum + score;
		}, 0);
		return Math.round((total / reviews.length / 5) * 100);
	};

	const currentValue = calculateAverage(data.currentPeriod);
	const previousValue = calculateAverage(data.previousPeriod);
	const change = calculatePercentageChange(previousValue, currentValue);

	return {
		value: `${currentValue}%`,
		change: formatPercentageChange(change),
	};
}

export function calculateFacilityRating(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): { value: string; change: string } {
	const calculateAverage = (reviews: any[]) => {
		if (!reviews?.length) return 0;
		const total = reviews.reduce((sum, review) => {
			const score = Number(review["The Camp Facilities"] || 0);
			return sum + score;
		}, 0);
		return Math.round((total / reviews.length / 5) * 100);
	};

	const currentValue = calculateAverage(data.currentPeriod);
	const previousValue = calculateAverage(data.previousPeriod);
	const change = calculatePercentageChange(previousValue, currentValue);

	return {
		value: `${currentValue}%`,
		change: formatPercentageChange(change),
	};
}

export function calculateFoodRating(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): { value: string; change: string } {
	const calculateAverage = (reviews: any[]) => {
		if (!reviews?.length) return 0;
		const total = reviews.reduce((sum, review) => {
			const score = Number(review["The Food"] || 0);
			return sum + score;
		}, 0);
		return Math.round((total / reviews.length / 5) * 100);
	};

	const currentValue = calculateAverage(data.currentPeriod);
	const previousValue = calculateAverage(data.previousPeriod);
	const change = calculatePercentageChange(previousValue, currentValue);

	return {
		value: `${currentValue}%`,
		change: formatPercentageChange(change),
	};
}

export function calculateHousekeepingRating(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): { value: string; change: string } {
	const calculateAverage = (reviews: any[]) => {
		if (!reviews?.length) return 0;
		const total = reviews.reduce((sum, review) => {
			const score = Number(review["Housekeeping"] || 0);
			return sum + score;
		}, 0);
		return Math.round((total / reviews.length / 5) * 100);
	};

	const currentValue = calculateAverage(data.currentPeriod);
	const previousValue = calculateAverage(data.previousPeriod);
	const change = calculatePercentageChange(previousValue, currentValue);

	return {
		value: `${currentValue}%`,
		change: formatPercentageChange(change),
	};
}

export function calculateStaffRating(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): { value: string; change: string } {
	const calculateAverage = (reviews: any[]) => {
		if (!reviews?.length) return 0;
		const total = reviews.reduce((sum, review) => {
			const score = Number(review["Our Staff"] || 0);
			return sum + score;
		}, 0);
		return Math.round((total / reviews.length / 5) * 100);
	};

	const currentValue = calculateAverage(data.currentPeriod);
	const previousValue = calculateAverage(data.previousPeriod);
	const change = calculatePercentageChange(previousValue, currentValue);

	return {
		value: `${currentValue}%`,
		change: formatPercentageChange(change),
	};
}

export function calculateOverallRating(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): { value: string; change: string } {
	const calculatePeriodAverage = (reviews: any[]) => {
		if (!reviews?.length) return 0;

		// Calculate each department's average
		const roomScore = reviews.reduce(
			(sum, review) => sum + Number(review["Your Accommodation"] || 0),
			0
		);
		const facilityScore = reviews.reduce(
			(sum, review) => sum + Number(review["The Camp Facilities"] || 0),
			0
		);
		const foodScore = reviews.reduce(
			(sum, review) => sum + Number(review["The Food"] || 0),
			0
		);
		const housekeepingScore = reviews.reduce(
			(sum, review) => sum + Number(review["Housekeeping"] || 0),
			0
		);
		const staffScore = reviews.reduce(
			(sum, review) => sum + Number(review["Our Staff"] || 0),
			0
		);

		// Calculate overall average
		const totalScore =
			roomScore +
			facilityScore +
			foodScore +
			housekeepingScore +
			staffScore;
		const totalPossibleScore = reviews.length * 5 * 5; // 5 departments * max score of 5

		return Math.round((totalScore / totalPossibleScore) * 100);
	};

	const currentValue = calculatePeriodAverage(data.currentPeriod);
	const previousValue = calculatePeriodAverage(data.previousPeriod);
	const change = calculatePercentageChange(previousValue, currentValue);

	return {
		value: `${currentValue}%`,
		change: formatPercentageChange(change),
	};
}

export interface StaffMention {
	name: string;
	mentions: number;
	previousMentions: number;
}

export function calculateStaffMentions(data: {
	currentPeriod: any[];
	previousPeriod: any[];
}): StaffMention[] {
	const calculateMentions = (reviews: any[]) => {
		const mentionCounts = new Map<string, number>();

		reviews.forEach((review) => {
			const mentions =
				review["Did anyone in particular standout?"]?.split(",") || [];
			mentions.forEach((name) => {
				const trimmedName = name.trim();
				if (trimmedName) {
					mentionCounts.set(
						trimmedName,
						(mentionCounts.get(trimmedName) || 0) + 1
					);
				}
			});
		});

		return mentionCounts;
	};

	const currentMentions = calculateMentions(data.currentPeriod);
	const previousMentions = calculateMentions(data.previousPeriod);

	// Combine all unique names
	const allNames = new Set([
		...currentMentions.keys(),
		...previousMentions.keys(),
	]);

	return Array.from(allNames)
		.map((name) => ({
			name,
			mentions: currentMentions.get(name) || 0,
			previousMentions: previousMentions.get(name) || 0,
		}))
		.sort((a, b) => b.mentions - a.mentions);
}
