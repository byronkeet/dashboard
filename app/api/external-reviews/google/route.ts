import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

export async function GET(request: Request) {
	try {
		if (!GOOGLE_API_KEY || !PLACE_ID) {
			return NextResponse.json(
				{ error: "Google Places API configuration missing" },
				{ status: 500 }
			);
		}

		// Get detailed place information including reviews
		const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=rating,user_ratings_total,reviews,price_level,business_status&key=${GOOGLE_API_KEY}`;

		const response = await fetch(detailsUrl);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				`Failed to fetch Google Places data: ${response.status}`
			);
		}

		if (data.status !== "OK") {
			throw new Error(`Google Places API error: ${data.status}`);
		}

		// Calculate rating breakdown
		const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => {
			const count = (data.result.reviews || []).filter(
				(review: any) => review.rating === rating
			).length;
			return { rating, count };
		});

		const processedData = {
			stats: {
				averageRating: data.result.rating || 0,
				totalReviews: data.result.user_ratings_total || 0,
				ratingBreakdown,
				// Additional metadata
				metadata: {
					priceLevel: data.result.price_level, // Returns 0-4, indicating price level
					businessStatus: data.result.business_status, // OPERATIONAL, CLOSED_TEMPORARILY, etc.
				},
			},
			reviews: (data.result.reviews || []).map((review: any) => ({
				id: review.time.toString(),
				platform: "google",
				rating: review.rating,
				text: review.text,
				date: new Date(review.time * 1000).toISOString(),
				reviewer: review.author_name,
				language: review.language,
				profilePhotoUrl: review.profile_photo_url,
				relativeTimeDescription: review.relative_time_description,
			})),
		};

		return NextResponse.json(processedData);
	} catch (error) {
		console.error("Error in Google Places API route:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch Google Places data",
				details:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
