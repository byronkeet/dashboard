import { useState, useEffect } from "react";
import {
	calculateGuestStats,
	calculateSubmissionStats,
	calculateOTSStats,
	StatCalculation,
} from "../calculations/stats";

interface StatsData {
	guestStats: StatCalculation;
	submissionStats: StatCalculation;
	otsStats: StatCalculation;
	isLoading: boolean;
	error: Error | null;
}

export function useStatsData(indemnityData: any, reviewData: any): StatsData {
	const [stats, setStats] = useState<StatsData>({
		guestStats: { value: "0", change: "0%" },
		submissionStats: { value: "0", change: "0%" },
		otsStats: { value: "0%", change: "0%" },
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		if (!indemnityData || !reviewData) {
			return;
		}

		try {
			const guestStats = calculateGuestStats(indemnityData);
			const submissionStats = calculateSubmissionStats(reviewData);
			const otsStats = calculateOTSStats(reviewData);

			setStats({
				guestStats,
				submissionStats,
				otsStats,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			setStats((prev) => ({
				...prev,
				isLoading: false,
				error:
					error instanceof Error
						? error
						: new Error("Failed to calculate stats"),
			}));
		}
	}, [indemnityData, reviewData]);

	return stats;
}
