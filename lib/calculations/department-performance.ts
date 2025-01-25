import { Review } from "@/lib/types";

export interface DepartmentMetric {
	name: string;
	current: number;
	previous: number;
}

export function calculateDepartmentPerformance(data: {
	currentPeriod: Review[];
	previousPeriod: Review[];
}): DepartmentMetric[] {
	const calculateAverage = (reviews: Review[], field: string) => {
		if (!reviews.length) return 0;
		const sum = reviews.reduce(
			(acc, review) => acc + Number(review[field] || 0),
			0
		);
		return Number(((sum / reviews.length / 5) * 100).toFixed(1));
	};

	return [
		{
			name: "Accommodation",
			current: calculateAverage(data.currentPeriod, "Your Accommodation"),
			previous: calculateAverage(
				data.previousPeriod,
				"Your Accommodation"
			),
		},
		{
			name: "Facilities",
			current: calculateAverage(
				data.currentPeriod,
				"The Camp Facilities"
			),
			previous: calculateAverage(
				data.previousPeriod,
				"The Camp Facilities"
			),
		},
		{
			name: "Food",
			current: calculateAverage(data.currentPeriod, "The Food"),
			previous: calculateAverage(data.previousPeriod, "The Food"),
		},
		{
			name: "Housekeeping",
			current: calculateAverage(data.currentPeriod, "Housekeeping"),
			previous: calculateAverage(data.previousPeriod, "Housekeeping"),
		},
		{
			name: "Staff",
			current: calculateAverage(data.currentPeriod, "Our Staff"),
			previous: calculateAverage(data.previousPeriod, "Our Staff"),
		},
	];
}
