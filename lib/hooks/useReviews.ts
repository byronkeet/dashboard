import { useState, useEffect } from "react";

interface UseReviewsResult {
	reviews: any[];
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
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				setIsLoading(true);
				const params = new URLSearchParams({
					from: dateRange.from.toISOString(),
					to: dateRange.to.toISOString(),
					page: currentPage.toString(),
				});

				const response = await fetch(
					`/api/reviews/paginated?${params}`
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				setReviews(data.reviews);
				setTotalPages(data.totalPages);
			} catch (error) {
				setError(
					error instanceof Error
						? error
						: new Error("Failed to fetch reviews")
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchReviews();
	}, [dateRange.from, dateRange.to, currentPage]);

	return {
		reviews,
		isLoading,
		error,
		currentPage,
		totalPages,
		setCurrentPage,
	};
}
