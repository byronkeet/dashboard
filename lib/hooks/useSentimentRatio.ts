import { useMemo } from "react";
import {
	calculateSentimentRatio,
	SentimentRatio,
} from "../calculations/sentiment-ratio";

interface SentimentRatioData {
	metrics: SentimentRatio[];
	isLoading: boolean;
	error: Error | null;
}

export function useSentimentRatio(
	reviewData: {
		currentPeriod?: any[];
		previousPeriod?: any[];
	} | null
): SentimentRatioData {
	const metrics = useMemo(() => {
		if (!reviewData?.currentPeriod) {
			return [];
		}

		try {
			return calculateSentimentRatio({
				currentPeriod: reviewData.currentPeriod,
				previousPeriod: reviewData.previousPeriod || [],
			});
		} catch (error) {
			console.error("Error calculating sentiment ratio:", error);
			return [];
		}
	}, [reviewData?.currentPeriod, reviewData?.previousPeriod]);

	return {
		metrics,
		isLoading: !reviewData,
		error: null,
	};
}
