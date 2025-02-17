"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DualDateRangePicker } from "@/components/dashboard/dual-date-range-picker";
import { useState, useEffect, useMemo } from "react";
import { useDateRange } from "@/lib/context/date-range-context";
import { useStatsData } from "@/lib/hooks/useStatsData";
import { StatCard } from "@/components/dashboard/stat-card";
import { DepartmentPerformanceChart } from "@/components/dashboard/department-performance-chart";
import { useDepartmentPerformance } from "@/lib/hooks/useDepartmentPerformance";
import { useSentimentRatio } from "@/lib/hooks/useSentimentRatio";
import { SentimentRatioChart } from "@/components/dashboard/sentiment-ratio-chart";
import { useReviews } from "@/lib/hooks/useReviews";
import { RecentReviewsTable } from "@/components/dashboard/recent-reviews-table";

export default function Dashboard() {
	const { currentPeriod, comparablePeriod } = useDateRange();
	const [indemnityData, setIndemnityData] = useState<{
		currentPeriod: any[];
		previousPeriod: any[];
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		reviews,
		currentPeriod: currentPeriodReviews,
		previousPeriod: previousPeriodReviews,
		isLoading: reviewsLoading,
		currentPage,
		totalPages,
		setCurrentPage,
	} = useReviews(currentPeriod);

	const reviewsData = useMemo(
		() => ({
			currentPeriod: currentPeriodReviews,
			previousPeriod: previousPeriodReviews,
		}),
		[currentPeriodReviews, previousPeriodReviews]
	);

	const { guestStats, submissionStats, otsStats, wrsStats, error } =
		useStatsData(indemnityData, reviewsData);

	const departmentPerformance = useDepartmentPerformance(reviewsData);
	const sentimentRatio = useSentimentRatio(reviewsData);

	useEffect(() => {
		const fetchIndemnityData = async () => {
			try {
				setIsLoading(true);
				const params = new URLSearchParams({
					from: currentPeriod.from.toISOString(),
					to: currentPeriod.to.toISOString(),
					compareFrom: comparablePeriod.from.toISOString(),
					compareTo: comparablePeriod.to.toISOString(),
				});

				const response = await fetch(`/api/indemnity?${params}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const { data } = await response.json();
				console.log("Response data:", data);

				setIndemnityData(data);
			} catch (error) {
				console.error("Error fetching indemnity data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchIndemnityData();
	}, [currentPeriod, comparablePeriod]);

	return (
		<div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
			<div className='flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0'>
				<h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
					Dashboard
				</h2>
				<DualDateRangePicker />
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<StatCard
					title='Total Guests Check In'
					value={guestStats.value}
					change={guestStats.change}
					isLoading={isLoading}
					textSize='text-sm font-medium'
					backgroundColor='bg-[#444444]'
					textColor='text-white'
					icon='UsersRound'
				/>
				<StatCard
					title='Total Submissions'
					value={submissionStats.value}
					change={submissionStats.change}
					isLoading={isLoading}
					textSize='text-sm font-medium'
					icon='Eye'
				/>
				<StatCard
					title='Average OTS'
					value={otsStats.value}
					change={otsStats.change}
					isLoading={isLoading}
					tooltip='Overall Trip Score'
					textSize='text-sm font-medium'
					icon='Compass'
				/>
				<StatCard
					title='Average WRS'
					value={wrsStats.value}
					change={wrsStats.change}
					isLoading={isLoading}
					tooltip='Would Recommend Score'
					textSize='text-sm font-medium'
					icon='ThumbsUp'
				/>
			</div>

			{/* Charts */}
			<div className='grid gap-4 grid-cols-1 md:grid-cols-7'>
				<DepartmentPerformanceChart
					data={departmentPerformance.metrics}
					isLoading={isLoading}
				/>

				<SentimentRatioChart
					data={sentimentRatio.metrics}
					isLoading={isLoading}
				/>
			</div>

			{/* Recent Reviews */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Reviews</CardTitle>
				</CardHeader>
				<CardContent>
					<RecentReviewsTable
						data={reviews}
						isLoading={reviewsLoading}
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
