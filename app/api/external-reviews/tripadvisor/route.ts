import { NextResponse } from "next/server";

const TRIPADVISOR_API_KEY = process.env.NEXT_PUBLIC_TRIPADVISOR_API_KEY;
const LOCATION_ID = process.env.NEXT_PUBLIC_TRIPADVISOR_LOCATION_ID;

export async function GET(request: Request) {
	try {
		if (!TRIPADVISOR_API_KEY || !LOCATION_ID) {
			return NextResponse.json(
				{ error: "TripAdvisor configuration missing" },
				{ status: 500 }
			);
		}

		// Fetch both details and reviews
		const [detailsResponse, reviewsResponse] = await Promise.all([
			fetch(
				`https://api.content.tripadvisor.com/api/v1/location/${LOCATION_ID}/details?language=en&key=${TRIPADVISOR_API_KEY}`
			),
			fetch(
				`https://api.content.tripadvisor.com/api/v1/location/${LOCATION_ID}/reviews?language=en&key=${TRIPADVISOR_API_KEY}`
			),
		]);

		if (!detailsResponse.ok || !reviewsResponse.ok) {
			throw new Error("Failed to fetch TripAdvisor data");
		}

		const [detailsData, reviewsData] = await Promise.all([
			detailsResponse.json(),
			reviewsResponse.json(),
		]);

		// Transform the reviews
		const transformedReviews = (reviewsData.data || [])
			.slice(0, 5) // Get only the 5 most recent reviews
			.map((review: any) => ({
				id: review.id.toString(),
				platform: "tripadvisor",
				rating: review.rating,
				text: review.text,
				date: review.published_date,
				reviewer: review.user?.username || "TripAdvisor User",
				title: review.title,
			}));

		// Transform rating count into array
		const ratingBreakdown = Object.entries(
			detailsData.review_rating_count || {}
		)
			.map(([rating, count]) => ({
				rating: parseInt(rating),
				count: parseInt(count as string),
			}))
			.sort((a, b) => b.rating - a.rating);

		// Transform subratings from object to array
		const subratings = detailsData.subratings
			? Object.values(detailsData.subratings)
					.filter(
						(rating: any) => rating.localized_name && rating.value
					)
					.map((rating: any) => ({
						name: rating.localized_name,
						value: parseFloat(rating.value),
					}))
			: undefined;

		const processedData = {
			stats: {
				averageRating: parseFloat(detailsData.rating),
				totalReviews: parseInt(detailsData.num_reviews),
				change: {
					rating: "0%",
					count: "0%",
				},
				ratingBreakdown,
				// Only include subratings if they exist and have values
				...(subratings && subratings.length > 0 ? { subratings } : {}),
			},
			reviews: transformedReviews,
		};

		return NextResponse.json(processedData);
	} catch (error) {
		console.error("Error in TripAdvisor API route:", error);
		return NextResponse.json(
			{ error: "Failed to fetch TripAdvisor data" },
			{ status: 500 }
		);
	}
}
