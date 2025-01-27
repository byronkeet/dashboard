import { Review, PaginatedResponse } from "./types";

// Simulated review data
const reviews: Review[] = Array.from({ length: 50 }, (_, i) => ({
	id: `review-${i + 1}`,
	name: `Guest ${i + 1}`,
	date: new Date(2024, 0, 1 - i).toLocaleString(),
	ots: Math.floor(Math.random() * 3) + 7, // Random score between 7-10
	wes: Math.floor(Math.random() * 3) + 7, // Random score between 7-10
	recommend: Math.random() > 0.2, // 80% chance of recommending
	"Your Accommodation": Math.floor(Math.random() * 2) + 3, // 3-5 rating
	"The Camp Facilities": Math.floor(Math.random() * 2) + 3,
	"The Food": Math.floor(Math.random() * 2) + 3,
	Housekeeping: Math.floor(Math.random() * 2) + 3,
	"Our Staff": Math.floor(Math.random() * 2) + 3,
	"How did you hear about Taludi?": "Online Search",
	"Full Name": `Guest ${i + 1}`,
	"Submitted On (UTC)": new Date(2024, 0, 1 - i).toISOString(),
	Nationality: "United Kingdom",
}));

export async function getReviews(
	page: number = 1,
	itemsPerPage: number = 10
): Promise<PaginatedResponse<Review>> {
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 500));

	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedReviews = reviews.slice(startIndex, endIndex);

	return {
		data: paginatedReviews,
		metadata: {
			currentPage: page,
			totalPages: Math.ceil(reviews.length / itemsPerPage),
			totalItems: reviews.length,
			itemsPerPage: itemsPerPage,
		},
	};
}
