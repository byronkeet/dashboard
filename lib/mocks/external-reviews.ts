import { ExternalReviewsData } from "../types/external-reviews";

export const mockTripAdvisorData: ExternalReviewsData = {
	stats: {
		averageRating: 4.7,
		totalReviews: 45,
		change: {
			rating: "+2.1%",
			count: "+12%",
		},
	},
	reviews: Array.from({ length: 45 }, (_, i) => ({
		id: `ta-${i + 1}`,
		platform: "tripadvisor",
		rating: Math.floor(Math.random() * 2) + 4, // Random 4-5 rating
		text: `Great experience at Tuludi! The wildlife viewing was exceptional and staff were amazing. Would highly recommend to anyone looking for a luxury safari experience.`,
		date: new Date(2024, 0, 1 - i).toISOString(),
		reviewer: `TripAdvisor User ${i + 1}`,
		title: `Exceptional Safari Experience ${i + 1}`,
	})),
};

export const mockGoogleData: ExternalReviewsData = {
	stats: {
		averageRating: 4.8,
		totalReviews: 38,
		change: {
			rating: "+1.8%",
			count: "+15%",
		},
	},
	reviews: Array.from({ length: 38 }, (_, i) => ({
		id: `g-${i + 1}`,
		platform: "google",
		rating: Math.floor(Math.random() * 2) + 4,
		text: `Beautiful lodge with incredible views. The game drives were fantastic and we saw all the big five!`,
		date: new Date(2024, 0, 1 - i).toISOString(),
		reviewer: `Google User ${i + 1}`,
	})),
};
