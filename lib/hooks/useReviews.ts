import { useState, useEffect, useCallback } from "react";

interface UseReviewsResult {
	reviews: any[];
	currentPeriod: any[];
	previousPeriod: any[];
	isLoading: boolean;
	error: Error | null;
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
}

export function useReviews(dateRange: {
	from: Date;
	to: Date;
}): UseReviewsResult {
	const [reviews, setReviews] = useState<any[]>([]);
	const [currentPeriodData, setCurrentPeriodData] = useState<any[]>([]);
	const [previousPeriodData, setPreviousPeriodData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const fetchReviews = useCallback(async () => {
		try {
			setIsLoading(true);
			const params = new URLSearchParams({
				from: dateRange.from.toISOString(),
				to: dateRange.to.toISOString(),
				page: currentPage.toString(),
			});

			console.log("Fetching reviews with params:", params.toString());
			const response = await fetch(`/api/reviews/paginated?${params}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("API Response:", data);

			if (!data.success) {
				throw new Error(data.message || "Failed to fetch reviews");
			}

			setReviews(data.reviews || []);
			setCurrentPeriodData(data.currentPeriod || []);
			setPreviousPeriodData(data.previousPeriod || []);
			setTotalPages(data.totalPages || 1);
		} catch (error) {
			console.error("Error in useReviews:", error);
			setError(
				error instanceof Error
					? error
					: new Error("Failed to fetch reviews")
			);
		} finally {
			setIsLoading(false);
		}
	}, [dateRange.from.toISOString(), dateRange.to.toISOString(), currentPage]);

	useEffect(() => {
		fetchReviews();
	}, [fetchReviews]);

	return {
		reviews,
		currentPeriod: currentPeriodData,
		previousPeriod: previousPeriodData,
		isLoading,
		error,
		currentPage,
		totalPages,
		setCurrentPage,
	};
}
