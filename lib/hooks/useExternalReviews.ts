import { useState, useEffect } from "react";
import { ExternalReviewsData } from "../types/external-reviews";
import { fetchTripAdvisorReviews } from "../services/external-reviews";

export function useExternalReviews(fromDate: Date, toDate: Date) {
	const [tripAdvisorData, setTripAdvisorData] =
		useState<ExternalReviewsData | null>(null);
	const [googleData, setGoogleData] = useState<ExternalReviewsData | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const taData = await fetchTripAdvisorReviews(fromDate, toDate);
				setTripAdvisorData(taData);

				// TODO: Implement Google Reviews fetch
				// const gData = await fetchGoogleReviews(fromDate, toDate);
				// setGoogleData(gData);
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error("Failed to fetch external reviews")
				);
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, [fromDate, toDate]);

	return {
		tripAdvisorData,
		googleData,
		isLoading,
		error,
	};
}
