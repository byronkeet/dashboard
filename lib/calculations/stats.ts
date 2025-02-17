import { Review } from "@/lib/types";

interface ReviewData {
	currentPeriod: Review[];
	previousPeriod: Review[];
}

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
		const guideStats = reviews.reduce(
			(
				acc: { [key: string]: { totalRating: number; count: number } },
				review
			) => {
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
			},
			{}
		);

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
		const sightings = reviews.reduce(
			(acc: Record<string, number>, review) => {
				const animals = (review["Key Sightings"] || "")
					.split(",")
					.map((animal: string) => animal.trim())
					.filter(Boolean);

				animals.forEach((animal: string) => {
					acc[animal] = (acc[animal] || 0) + 1;
				});

				return acc;
			},
			{}
		);

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
		const activities = reviews.reduce(
			(acc: Record<string, number>, review) => {
				const activities = (review["What activities did you do?"] || "")
					.split(",")
					.map((activity: string) => activity.trim())
					.filter(Boolean);

				activities.forEach((activity: string) => {
					acc[activity] = (acc[activity] || 0) + 1;
				});

				return acc;
			},
			{}
		);

		return Object.entries(activities).map(
			([name, count]): { name: string; count: number } => ({
				name,
				count,
			})
		);
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
			mentions.forEach((name: string) => {
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
	const allNames = Array.from(
		new Set([
			...Array.from(currentMentions.keys()),
			...Array.from(previousMentions.keys()),
		])
	);

	return allNames
		.map((name) => ({
			name,
			mentions: currentMentions.get(name) || 0,
			previousMentions: previousMentions.get(name) || 0,
		}))
		.sort((a, b) => b.mentions - a.mentions);
}

export interface FacilityComment {
	name: string;
	sentiment: "POSITIVE" | "NEGATIVE";
	comment: string;
	date: string;
}

export function calculateFacilityComments(data: {
	currentPeriod: any[];
}): FacilityComment[] {
	return data.currentPeriod
		.filter(
			(review) =>
				review[
					"Any Further Comments or Recommendations about our hospitality?"
				]
		)
		.map((review) => ({
			name: review["Full Name"] || "Anonymous",
			sentiment: review["Hospitality Comment Sentiment"] || "POSITIVE",
			comment:
				review[
					"Any Further Comments or Recommendations about our hospitality?"
				],
			date: review["Submitted On (UTC)"],
		}))
		.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
}

// Add these types at the top with other type definitions
export type MarketingSource = {
	name: string;
	value: number;
	previousValue: number;
	count: number;
	previousCount: number;
};

export type CommunicationRating = {
	name: string;
	value: number;
	count: number;
};

// Add these functions alongside other calculation functions
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
	const sources = Array.from(
		new Set([
			...Object.keys(currentSources),
			...Object.keys(previousSources),
		])
	);

	return sources
		.map((source) => ({
			name: source,
			value: ((currentSources[source] || 0) / currentTotal) * 100,
			previousValue:
				((previousSources[source] || 0) / previousTotal) * 100,
			count: currentSources[source] || 0,
			previousCount: previousSources[source] || 0,
		}))
		.sort((a, b) => b.value - a.value);
}

export function calculateCommunicationRatings(
	reviewData: ReviewData
): CommunicationRating[] {
	if (!reviewData?.currentPeriod || !reviewData?.previousPeriod) {
		return [];
	}

	const calculateAverage = (reviews: any[]) => {
		if (!reviews?.length) return 0;
		const total = reviews.reduce((sum, review) => {
			const score = Number(review.Communication || 0);
			return sum + score;
		}, 0);
		return Number((total / reviews.length).toFixed(2));
	};

	return [
		{
			name: "Current Period",
			value: calculateAverage(reviewData.currentPeriod),
			count: reviewData.currentPeriod.length,
		},
		{
			name: "Previous Period",
			value: calculateAverage(reviewData.previousPeriod),
			count: reviewData.previousPeriod.length,
		},
	];
}

export type TravelAgent = {
	name: string;
	bookings: number;
};

export function calculateTopTravelAgents(
	reviewData: ReviewData
): TravelAgent[] {
	if (!reviewData?.currentPeriod) {
		return [];
	}

	// Count bookings per agent
	const agentCounts = reviewData.currentPeriod.reduce((acc, review) => {
		const agent = review["Name of Travel Agent"];
		if (agent) {
			acc[agent] = (acc[agent] || 0) + 1;
		}
		return acc;
	}, {} as Record<string, number>);

	// Convert to array and sort by bookings
	return Object.entries(agentCounts)
		.map(([name, bookings]) => ({
			name,
			bookings,
		}))
		.sort((a, b) => b.bookings - a.bookings)
		.slice(0, 5); // Only return top 3
}

// Add at the top of the file
type CountryCoordinates = {
	[key: string]: [number, number];
};

export const countryCoordinates: CountryCoordinates = {
	Afghanistan: [67.7097, 33.9391],
	Albania: [20.1683, 41.1533],
	Algeria: [1.6596, 28.0339],
	Angola: [17.8739, -11.2027],
	Argentina: [-63.6167, -38.4161],
	Australia: [133.7751, -25.2744],
	Austria: [14.5501, 47.5162],
	Azerbaijan: [47.5769, 40.1431],
	Bahamas: [-77.3963, 25.0343],
	Bangladesh: [90.3563, 23.685],
	Belarus: [27.9534, 53.7098],
	Belgium: [4.4699, 50.5039],
	Belize: [-88.4976, 17.1899],
	Benin: [2.3158, 9.3077],
	Bhutan: [90.4336, 27.5142],
	Bolivia: [-63.5887, -16.2902],
	"Bosnia and Herzegovina": [17.6791, 43.9159],
	Botswana: [24.6849, -22.3285],
	Brazil: [-51.9253, -14.235],
	Bulgaria: [25.4858, 42.7339],
	"Burkina Faso": [-1.5616, 12.2383],
	Burundi: [29.9189, -3.3731],
	Cambodia: [104.991, 12.5657],
	Cameroon: [12.3547, 7.3697],
	Canada: [-106.3468, 56.1304],
	"Central African Republic": [20.9394, 6.6111],
	Chad: [18.7322, 15.4542],
	Chile: [-71.5429, -35.6751],
	China: [104.1954, 35.8617],
	Colombia: [-74.2973, 4.5709],
	Congo: [15.2832, -0.228],
	"Costa Rica": [-83.7534, 9.7489],
	Croatia: [15.2, 45.1],
	Cuba: [-77.7812, 21.5218],
	Cyprus: [33.4299, 35.1264],
	"Czech Republic": [15.473, 49.8175],
	Denmark: [9.5018, 56.2639],
	"Dominican Republic": [-70.1627, 18.7357],
	Ecuador: [-78.1834, -1.8312],
	Egypt: [30.8025, 26.8206],
	"El Salvador": [-88.8965, 13.7942],
	Eritrea: [39.7823, 15.1794],
	Estonia: [25.0136, 58.5953],
	Ethiopia: [40.4897, 9.145],
	Fiji: [179.4144, -16.5782],
	Finland: [25.7482, 61.9241],
	France: [2.2137, 46.2276],
	Gabon: [11.6094, -0.8037],
	Georgia: [43.3569, 42.3154],
	Germany: [10.4515, 51.1657],
	Ghana: [-1.0232, 7.9465],
	Greece: [21.8243, 39.0742],
	Guatemala: [-90.2308, 15.7835],
	Guinea: [-9.6966, 9.9456],
	Haiti: [-72.2852, 18.9712],
	Honduras: [-86.2419, 15.1994],
	Hungary: [19.5033, 47.1625],
	Iceland: [-19.0208, 64.9631],
	India: [78.9629, 20.5937],
	Indonesia: [113.9213, -0.7893],
	Iran: [53.688, 32.4279],
	Iraq: [43.6793, 33.2232],
	Ireland: [-8.2439, 53.4129],
	Israel: [34.8516, 31.0461],
	Italy: [12.5674, 41.8719],
	Jamaica: [-77.2975, 18.1096],
	Japan: [138.2529, 36.2048],
	Jordan: [36.2384, 30.5852],
	Kazakhstan: [66.9237, 48.0196],
	Kenya: [37.9062, -0.0236],
	Kuwait: [47.4818, 29.3117],
	Laos: [102.4955, 19.8563],
	Latvia: [24.6032, 56.8796],
	Lebanon: [35.8623, 33.8547],
	Lesotho: [28.2336, -29.6099],
	Liberia: [-9.4295, 6.4281],
	Libya: [17.2283, 26.3351],
	Lithuania: [23.8813, 55.1694],
	Luxembourg: [6.1296, 49.8153],
	Madagascar: [46.8691, -18.7669],
	Malawi: [34.3015, -13.2543],
	Malaysia: [101.9758, 4.2105],
	Mali: [-3.9962, 17.5707],
	Malta: [14.3754, 35.9375],
	Mauritania: [-10.9408, 21.0079],
	Mexico: [-102.5528, 23.6345],
	Moldova: [28.3699, 47.4116],
	Mongolia: [103.8467, 46.8625],
	Montenegro: [19.3744, 42.7087],
	Morocco: [-7.0926, 31.7917],
	Mozambique: [35.5296, -18.6657],
	Myanmar: [95.956, 21.9162],
	Namibia: [18.4904, -22.9576],
	Nepal: [84.124, 28.3949],
	Netherlands: [5.2913, 52.1326],
	"New Zealand": [174.886, -40.9006],
	Nicaragua: [-85.2072, 12.8654],
	Niger: [8.0817, 17.6078],
	Nigeria: [8.6753, 9.082],
	"North Korea": [127.5101, 40.3399],
	"North Macedonia": [21.7453, 41.6086],
	Norway: [8.4689, 60.472],
	Oman: [55.9754, 21.4735],
	Pakistan: [69.3451, 30.3753],
	Panama: [-80.7821, 8.538],
	"Papua New Guinea": [143.9555, -6.3149],
	Paraguay: [-58.4438, -23.4425],
	Peru: [-75.0152, -9.19],
	Philippines: [121.774, 12.8797],
	Poland: [19.1451, 51.9194],
	Portugal: [-8.2245, 39.3999],
	Qatar: [51.1839, 25.3548],
	Romania: [24.9668, 45.9432],
	Russia: [105.3188, 61.524],
	Rwanda: [29.8739, -1.9403],
	"Saudi Arabia": [45.0792, 23.8859],
	Senegal: [-14.4524, 14.4974],
	Serbia: [21.0059, 44.0165],
	"Sierra Leone": [-11.7799, 8.4606],
	Singapore: [103.8198, 1.3521],
	Slovakia: [19.699, 48.669],
	Slovenia: [14.9955, 46.1512],
	Somalia: [46.1996, 5.1521],
	"South Africa": [22.9375, -30.5595],
	"South Korea": [127.7669, 35.9078],
	"South Sudan": [31.307, 6.877],
	Spain: [-3.7492, 40.4637],
	"Sri Lanka": [80.7718, 7.8731],
	Sudan: [30.2176, 12.8628],
	Sweden: [18.6435, 60.1282],
	Switzerland: [8.2275, 46.8182],
	Syria: [38.9968, 34.8021],
	Taiwan: [120.9605, 23.6978],
	Tajikistan: [71.2761, 38.861],
	Tanzania: [34.8888, -6.369],
	Thailand: [100.9925, 15.87],
	Togo: [0.8248, 8.6195],
	Tunisia: [9.5375, 33.8869],
	Turkey: [35.2433, 38.9637],
	Turkmenistan: [59.5563, 38.9697],
	Uganda: [32.2903, 1.3733],
	Ukraine: [31.1656, 48.3794],
	"United Arab Emirates": [53.8478, 23.4241],
	"United Kingdom": [-3.4359, 55.3781],
	"United States": [-95.7129, 37.0902],
	"United States of America": [-95.7129, 37.0902],
	Uruguay: [-55.7658, -32.5228],
	Uzbekistan: [64.5853, 41.3775],
	Venezuela: [-66.5897, 6.4238],
	Vietnam: [108.2772, 14.0583],
	Yemen: [48.5164, 15.5527],
	Zambia: [27.8493, -13.1339],
	Zimbabwe: [29.1549, -19.0154],
};

export type GuestNationality = {
	country: string;
	count: number;
	coordinates: [number, number];
};

export function calculateGuestNationalities(
	reviewData: ReviewData
): GuestNationality[] {
	if (!reviewData?.currentPeriod) {
		return [];
	}

	// Count nationalities
	const nationalityCounts = reviewData.currentPeriod.reduce((acc, review) => {
		const nationality = review.Nationality;
		if (nationality && countryCoordinates[nationality]) {
			acc[nationality] = (acc[nationality] || 0) + 1;
		}
		return acc;
	}, {} as Record<string, number>);

	// Convert to array with coordinates
	return Object.entries(nationalityCounts)
		.map(([country, count]) => ({
			country,
			count,
			coordinates: countryCoordinates[country],
		}))
		.sort((a: GuestNationality, b: GuestNationality) => b.count - a.count);
}

export type GuestComment = {
	name: string;
	sentiment: "POSITIVE" | "NEGATIVE";
	comment?: string;
	date: string;
};

export function calculateGuestComments(data: ReviewData): GuestComment[] {
	if (!data?.currentPeriod) return [];

	return data.currentPeriod
		.filter((review) =>
			Boolean(review["Any Further Comments or Recommendations?"])
		)
		.map((review) => ({
			name: review["Full Name"] || "Anonymous",
			sentiment:
				review["Overall Comment Sentiment"] === "Positive"
					? "POSITIVE"
					: "NEGATIVE",
			comment: review["Any Further Comments or Recommendations?"],
			date: review["Submitted On (UTC)"],
		}));
}
