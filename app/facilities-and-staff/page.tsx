"use client";

import { DualDateRangePicker } from "@/components/dashboard/dual-date-range-picker";
import { useMemo } from "react";
import { TooltipProps } from "recharts";
import { useDateRange } from "@/lib/context/date-range-context";
import { useReviews } from "@/lib/hooks/useReviews";
import { StatCard } from "@/components/dashboard/stat-card";
import {
	calculateRoomRating,
	calculateFacilityRating,
	calculateFoodRating,
	calculateHousekeepingRating,
	calculateStaffRating,
	calculateOverallRating,
	calculateStaffMentions,
	calculateFacilityComments,
} from "@/lib/calculations/stats";
import { StaffMentionsChart } from "@/components/facilities/staff-mentions-chart";
import { FacilityComments } from "@/components/facilities/facility-comments";

type StaffMention = {
	name: string;
	count: number;
};

type FacilityComment = {
	name: string;
	sentiment: "POSITIVE" | "NEGATIVE";
	comment: string;
	date: string;
};

export default function FacilitiesStaffPage() {
	const { currentPeriod, comparablePeriod } = useDateRange();

	const {
		currentPeriod: currentPeriodReviews,
		previousPeriod: previousPeriodReviews,
		isLoading: reviewsLoading,
	} = useReviews(currentPeriod, comparablePeriod);

	const CustomTooltip = ({
		active,
		payload,
		label,
	}: TooltipProps<number, string>) => {
		if (active && payload && payload.length) {
			return (
				<div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
					<p className='text-sm font-medium text-gray-900'>{label}</p>
					{payload.map((entry) => (
						<p
							key={entry.name}
							className='text-sm'
							style={{ color: entry.color }}
						>
							{entry.name}: {entry.value}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	const reviewsData = useMemo(
		() => ({
			currentPeriod: currentPeriodReviews,
			previousPeriod: previousPeriodReviews,
		}),
		[currentPeriodReviews, previousPeriodReviews]
	);

	const roomRating = calculateRoomRating(reviewsData);
	const facilityRating = calculateFacilityRating(reviewsData);
	const foodRating = calculateFoodRating(reviewsData);
	const housekeepingRating = calculateHousekeepingRating(reviewsData);
	const staffRating = calculateStaffRating(reviewsData);
	const overallRating = calculateOverallRating(reviewsData);
	const staffMentions = calculateStaffMentions(reviewsData);
	const facilityComments = calculateFacilityComments(reviewsData);

	return (
		<div className='flex-1 space-y-4 p-4 md:p-8 pt-6 pb-16 md:pb-8'>
			<div className='flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0'>
				<h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
					Facilities & Staff
				</h2>
				<div className='flex items-center space-x-2'>
					<DualDateRangePicker />
				</div>
			</div>

			<div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
				<StatCard
					title='Average Room Rating'
					value={roomRating.value}
					change={roomRating.change}
					isLoading={reviewsLoading}
					tooltip='Average rating for accommodation'
					format='percentage'
				/>

				<StatCard
					title='Average Facility Rating'
					value={facilityRating.value}
					change={facilityRating.change}
					isLoading={reviewsLoading}
					tooltip='Average rating for camp facilities'
					format='percentage'
				/>

				<StatCard
					title='Average Food Rating'
					value={foodRating.value}
					change={foodRating.change}
					isLoading={reviewsLoading}
					tooltip='Average rating for food'
					format='percentage'
				/>

				<StatCard
					title='Average Housekeeping Rating'
					value={housekeepingRating.value}
					change={housekeepingRating.change}
					isLoading={reviewsLoading}
					tooltip='Average rating for housekeeping'
					format='percentage'
				/>

				<StatCard
					title='Average Staff Rating'
					value={staffRating.value}
					change={staffRating.change}
					isLoading={reviewsLoading}
					tooltip='Average rating for staff'
					format='percentage'
				/>

				<StatCard
					title='Ave Overall Score'
					value={overallRating.value}
					change={overallRating.change}
					isLoading={reviewsLoading}
					tooltip='Average of all department ratings'
					format='percentage'
					backgroundColor='bg-gray-900'
					textColor='text-white'
				/>
			</div>

			<div className='grid gap-4 grid-cols-1'>
				<StaffMentionsChart
					data={staffMentions}
					isLoading={reviewsLoading}
				/>
				<FacilityComments
					data={facilityComments}
					isLoading={reviewsLoading}
				/>
			</div>
		</div>
	);
}
