export interface ExternalReview {
	id: string;
	platform: "tripadvisor" | "google";
	rating: number;
	text: string;
	date: string;
	reviewer: string;
	title?: string;
}

export interface ExternalReviewStats {
	averageRating: number;
	totalReviews: number;
	change: {
		rating: string;
		count: string;
	};
}

export interface ExternalReviewsData {
	stats: {
		averageRating: number;
		totalReviews: number;
		change: {
			rating: string;
			count: string;
		};
		ratingBreakdown?: Array<{
			rating: number;
			count: number;
		}>;
		subratings?: Array<{
			name: string;
			value: number;
		}>;
	};
	reviews: ExternalReview[];
}
