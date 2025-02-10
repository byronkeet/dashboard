import { NextResponse } from "next/server";
import { headers } from "next/headers";

const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY;
const LOCATION_ID = process.env.TRIPADVISOR_LOCATION_ID;

export async function GET(request: Request) {
	try {
		// Log the full request details
		const headersList = headers();
		console.log("Request Debug Info:", {
			url: request.url,
			host: headersList.get("host"),
			origin: headersList.get("origin"),
			forwardedFor: headersList.get("x-forwarded-for"),
			realIp: headersList.get("x-real-ip"),
		});

		// Add debug logging
		console.log("TripAdvisor API Configuration:", {
			hasApiKey: !!TRIPADVISOR_API_KEY,
			hasLocationId: !!LOCATION_ID,
			nodeEnv: process.env.NODE_ENV,
		});

		if (!TRIPADVISOR_API_KEY || !LOCATION_ID) {
			console.error("Missing configuration:", {
				apiKey: !TRIPADVISOR_API_KEY ? "missing" : "present",
				locationId: !LOCATION_ID ? "missing" : "present",
			});
			return NextResponse.json(
				{ error: "TripAdvisor configuration missing" },
				{ status: 500 }
			);
		}

		// Fetch both details and reviews
		const detailsUrl = `https://api.content.tripadvisor.com/api/v1/location/${LOCATION_ID}/details?language=en&key=${TRIPADVISOR_API_KEY}`;
		const reviewsUrl = `https://api.content.tripadvisor.com/api/v1/location/${LOCATION_ID}/reviews?language=en&key=${TRIPADVISOR_API_KEY}`;

		console.log("Fetching TripAdvisor data...");

		const [detailsResponse, reviewsResponse] = await Promise.all([
			fetch(detailsUrl),
			fetch(reviewsUrl),
		]);

		// Log response status
		console.log("API Response Status:", {
			details: detailsResponse.status,
			reviews: reviewsResponse.status,
		});

		if (!detailsResponse.ok || !reviewsResponse.ok) {
			const detailsText = await detailsResponse.text();
			const reviewsText = await reviewsResponse.text();

			console.error("TripAdvisor API Error Responses:", {
				details: {
					status: detailsResponse.status,
					body: detailsText,
				},
				reviews: {
					status: reviewsResponse.status,
					body: reviewsText,
				},
			});

			throw new Error(
				`Failed to fetch TripAdvisor data: Details(${detailsResponse.status}), Reviews(${reviewsResponse.status})`
			);
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
		console.error("Error in TripAdvisor API route:", {
			message: error instanceof Error ? error.message : "Unknown error",
			stack: error instanceof Error ? error.stack : undefined,
		});

		return NextResponse.json(
			{
				error: "Failed to fetch TripAdvisor data",
				details:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
