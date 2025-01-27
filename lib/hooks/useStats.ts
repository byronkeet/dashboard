import { useState, useEffect } from "react";
import { Stats, ComparisonData, StatsComparisonData } from "@/lib/types";
import { fetchData } from "@/lib/api";
import { useDateRange } from "@/lib/context/date-range-context";

export function useStats() {
	const { currentPeriod, comparablePeriod } = useDateRange();
	const [stats, setStats] = useState<StatsComparisonData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function loadStats() {
			try {
				setIsLoading(true);
				const data = await fetchData<Stats>("stats", {
					from: currentPeriod.from,
					to: currentPeriod.to,
				});

				// Calculate percentage changes
				const percentageChanges = {
					totalGuests: calculatePercentageChange(
						data.previous?.totalGuests,
						data.current.totalGuests
					),
					totalSubmissions: calculatePercentageChange(
						data.previous?.totalSubmissions,
						data.current.totalSubmissions
					),
					averageOTS: calculatePercentageChange(
						data.previous?.averageOTS,
						data.current.averageOTS
					),
					averageWRS: calculatePercentageChange(
						data.previous?.averageWRS,
						data.current.averageWRS
					),
				};

				setStats({
					current: data.current,
					previous: data.previous,
					percentageChange: percentageChanges,
				});
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error("Failed to load stats")
				);
			} finally {
				setIsLoading(false);
			}
		}

		loadStats();
	}, [currentPeriod, comparablePeriod]);

	return { stats, isLoading, error };
}

function calculatePercentageChange(
	previous?: number,
	current?: number
): number {
	if (!previous || !current) return 0;
	return ((current - previous) / previous) * 100;
}
