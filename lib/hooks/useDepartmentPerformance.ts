import { useState, useEffect, useMemo } from "react";
import {
	calculateDepartmentPerformance,
	DepartmentMetric,
} from "../calculations/department-performance";

interface DepartmentPerformanceData {
	metrics: DepartmentMetric[];
	isLoading: boolean;
	error: Error | null;
}

export function useDepartmentPerformance(
	reviewData: {
		currentPeriod?: any[];
		previousPeriod?: any[];
	} | null
): DepartmentPerformanceData {
	// Use useMemo to prevent unnecessary recalculations
	const metrics = useMemo(() => {
		if (!reviewData?.currentPeriod || !reviewData?.previousPeriod) {
			return [];
		}

		try {
			return calculateDepartmentPerformance({
				currentPeriod: reviewData.currentPeriod,
				previousPeriod: reviewData.previousPeriod,
			});
		} catch (error) {
			console.error("Error calculating department performance:", error);
			return [];
		}
	}, [reviewData?.currentPeriod, reviewData?.previousPeriod]);

	return {
		metrics,
		isLoading: !reviewData,
		error: null,
	};
}
