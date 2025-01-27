import { ReviewData } from "@/lib/types";

export type CommunicationRating = {
	name: string;
	value: number;
	count: number;
};

export function calculateCommunicationRatings(
	reviewData: ReviewData
): CommunicationRating[] {
	if (!reviewData?.currentPeriod || !reviewData?.previousPeriod) {
		return [];
	}

	const calculateAverage = (reviews: any[]) => {
		if (!reviews?.length) return 0;
		const total = reviews.reduce((sum, review) => {
			const score = Number(review.Communication || 0);
			return sum + score;
		}, 0);
		return Number((total / reviews.length).toFixed(2));
	};

	return [
		{
			name: "Current Period",
			value: calculateAverage(reviewData.currentPeriod),
			count: reviewData.currentPeriod.length,
		},
		{
			name: "Previous Period",
			value: calculateAverage(reviewData.previousPeriod),
			count: reviewData.previousPeriod.length,
		},
	];
}
