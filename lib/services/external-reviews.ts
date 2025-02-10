import { ExternalReviewsData, ExternalReview } from "../types/external-reviews";

const TRIPADVISOR_API_KEY = process.env.NEXT_PUBLIC_TRIPADVISOR_API_KEY;
const LOCATION_ID = process.env.NEXT_PUBLIC_TRIPADVISOR_LOCATION_ID;

export async function fetchTripAdvisorReviews(
	fromDate: Date,
	toDate: Date
): Promise<ExternalReviewsData> {
	try {
		// Only return mock data if no API key
		if (!process.env.NEXT_PUBLIC_TRIPADVISOR_API_KEY) {
			const { mockTripAdvisorData } = await import(
				"../mocks/external-reviews"
			);
			return mockTripAdvisorData;
		}

		const params = new URLSearchParams({
			from: fromDate.toISOString(),
			to: toDate.toISOString(),
		});

		const response = await fetch(
			`/api/external-reviews/tripadvisor?${params}`
		);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				`API error: ${response.statusText}${
					data.details ? ` - ${data.details}` : ""
				}`
			);
		}

		if (data.error) {
			throw new Error(
				`API error: ${data.error}${
					data.details ? ` - ${data.details}` : ""
				}`
			);
		}

		return data;
	} catch (error) {
		console.error("Error fetching TripAdvisor reviews:", error);
		throw error;
	}
}
