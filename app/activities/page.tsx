"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DualDateRangePicker } from "@/components/dashboard/dual-date-range-picker";
import { useMemo } from "react";
import { useDateRange } from "@/lib/context/date-range-context";
import { useReviews } from "@/lib/hooks/useReviews";
import {
	calculateWESStats,
	calculateGuideRatingStats,
	calculateGuideMetrics,
	calculateWildlifeSightings,
	calculateActivityComments,
	calculateActivityCounts,
} from "@/lib/calculations/stats";
import { StatCard } from "@/components/dashboard/stat-card";
import { GuidePerformanceChart } from "@/components/activities/guide-performance-chart";
import { WildlifeSightingsChart } from "@/components/activities/wildlife-sightings-chart";
import { ActivityComments } from "@/components/activities/activity-comments";
import { ActivityCountsChart } from "@/components/activities/activity-counts-chart";

export default function ActivitiesPage() {
	const { currentPeriod, comparablePeriod, onDateRangeChange } =
		useDateRange();

	const {
		currentPeriod: currentPeriodReviews,
		previousPeriod: previousPeriodReviews,
		isLoading: reviewsLoading,
	} = useReviews(currentPeriod, comparablePeriod);

	const reviewsData = useMemo(
		() => ({
			currentPeriod: currentPeriodReviews,
			previousPeriod: previousPeriodReviews,
		}),
		[currentPeriodReviews, previousPeriodReviews]
	);

	const wesStats = calculateWESStats(reviewsData);
	const guideRatingStats = calculateGuideRatingStats(reviewsData);
	const guideMetrics = calculateGuideMetrics(reviewsData);
	const wildlifeMetrics = calculateWildlifeSightings(reviewsData);
	const comments = calculateActivityComments(reviewsData);
	const activityCounts = calculateActivityCounts(reviewsData);

	return (
		<div className='flex-1 space-y-4 p-4 md:p-8 pt-6 pb-16 md:pb-8'>
			<div className='flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0'>
				<h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
					Activity Dashboard
				</h2>
				<div className='flex items-center space-x-2'>
					<DualDateRangePicker
						currentPeriod={currentPeriod}
						comparablePeriod={comparablePeriod}
						onUpdate={onDateRangeChange}
					/>
				</div>
			</div>

			<div className='grid gap-4 grid-cols-1 md:grid-cols-12'>
				{/* First row */}
				<div className='col-span-1 md:col-span-4 grid grid-rows-[1fr_1fr] gap-4 h-100'>
					<StatCard
						title='Ave WES Score'
						value={wesStats.value}
						change={wesStats.change}
						isLoading={reviewsLoading}
						tooltip='Average Wildlife Experience Score'
						backgroundColor='bg-gray-900'
						textColor='text-white'
					/>

					<StatCard
						title='Ave Guide Rating'
						value={guideRatingStats.value}
						change={guideRatingStats.change}
						isLoading={reviewsLoading}
						tooltip='Average Guide Rating Score'
					/>
				</div>

				<GuidePerformanceChart
					data={guideMetrics}
					isLoading={reviewsLoading}
				/>

				<WildlifeSightingsChart
					data={wildlifeMetrics}
					isLoading={reviewsLoading}
				/>

				{/* Second row */}
				<ActivityComments
					data={comments}
					isLoading={reviewsLoading}
				/>

				{/* Third row */}
				<ActivityCountsChart
					data={activityCounts}
					isLoading={reviewsLoading}
				/>
			</div>
		</div>
	);
}
