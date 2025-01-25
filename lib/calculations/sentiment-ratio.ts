interface SentimentData {
	currentPeriod: any[];
	previousPeriod: any[];
}

export interface SentimentRatio {
	name: string;
	value: number;
	previousValue: number;
}

export function calculateSentimentRatio(data: SentimentData): SentimentRatio[] {
	if (!data.currentPeriod?.length) return [];

	// Calculate current period
	let currentPositive = 0;
	let currentNegative = 0;
	let currentTotal = 0;

	data.currentPeriod.forEach((review) => {
		// Wildlife sentiments
		if (review["Wildlife Comment Sentiment"]) {
			currentTotal++;
			if (review["Wildlife Comment Sentiment"] === "Positive")
				currentPositive++;
			if (review["Wildlife Comment Sentiment"] === "Negative")
				currentNegative++;
		}

		// Hospitality sentiments
		if (review["Hospitality Comment Sentiment"]) {
			currentTotal++;
			if (review["Hospitality Comment Sentiment"] === "Positive")
				currentPositive++;
			if (review["Hospitality Comment Sentiment"] === "Negative")
				currentNegative++;
		}

		// Overall sentiments
		if (review["Overall Comment Sentiment"]) {
			currentTotal++;
			if (review["Overall Comment Sentiment"] === "Positive")
				currentPositive++;
			if (review["Overall Comment Sentiment"] === "Negative")
				currentNegative++;
		}
	});

	// Calculate previous period
	let previousPositive = 0;
	let previousNegative = 0;
	let previousTotal = 0;

	data.previousPeriod?.forEach((review) => {
		// Wildlife sentiments
		if (review["Wildlife Comment Sentiment"]) {
			previousTotal++;
			if (review["Wildlife Comment Sentiment"] === "Positive")
				previousPositive++;
			if (review["Wildlife Comment Sentiment"] === "Negative")
				previousNegative++;
		}

		// Hospitality sentiments
		if (review["Hospitality Comment Sentiment"]) {
			previousTotal++;
			if (review["Hospitality Comment Sentiment"] === "Positive")
				previousPositive++;
			if (review["Hospitality Comment Sentiment"] === "Negative")
				previousNegative++;
		}

		// Overall sentiments
		if (review["Overall Comment Sentiment"]) {
			previousTotal++;
			if (review["Overall Comment Sentiment"] === "Positive")
				previousPositive++;
			if (review["Overall Comment Sentiment"] === "Negative")
				previousNegative++;
		}
	});

	// Only create ratio if we have current sentiments to analyze
	if (currentTotal === 0) return [];

	return [
		{
			name: "Positive",
			value: Math.round((currentPositive / currentTotal) * 100),
			previousValue:
				previousTotal > 0
					? Math.round((previousPositive / previousTotal) * 100)
					: 0,
		},
		{
			name: "Negative",
			value: Math.round((currentNegative / currentTotal) * 100),
			previousValue:
				previousTotal > 0
					? Math.round((previousNegative / previousTotal) * 100)
					: 0,
		},
	];
}
