"use client";

import { DualDateRangePicker } from "@/components/dashboard/dual-date-range-picker";
import { StatCard } from "@/components/dashboard/stat-card";
import { ReviewsList } from "@/components/external-reviews/reviews-list";
import { useDateRange } from "@/lib/context/date-range-context";
import { useExternalReviews } from "@/lib/hooks/useExternalReviews";

export default function ExternalReviewsPage() {
	const { currentPeriod } = useDateRange();
	const { tripAdvisorData, googleData, isLoading, error } =
		useExternalReviews(currentPeriod.from, currentPeriod.to);

	if (error) {
		return <div>Error loading external reviews: {error.message}</div>;
	}

	return (
		<div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
			<div className='flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0'>
				<h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
					External Reviews
				</h2>
				<DualDateRangePicker />
			</div>

			<div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
				{/* TripAdvisor Section */}
				<div className='space-y-4'>
					<div className='grid gap-4 grid-cols-2'>
						<StatCard
							title='TripAdvisor Rating'
							value={
								tripAdvisorData?.stats.averageRating.toString() ??
								"0"
							}
							isLoading={isLoading}
							icon='ThumbsUp'
							backgroundColor='bg-[#444444]'
							textColor='text-white'
						/>
						<StatCard
							title='Total Reviews'
							value={
								tripAdvisorData?.stats.totalReviews.toString() ??
								"0"
							}
							isLoading={isLoading}
							icon='UsersRound'
						/>
					</div>

					{/* Rating Breakdown */}
					{tripAdvisorData?.stats.ratingBreakdown && (
						<div className='bg-white p-4 rounded-lg shadow'>
							<h3 className='text-lg font-semibold mb-3'>
								Rating Breakdown
							</h3>
							<div className='space-y-2'>
								{tripAdvisorData.stats.ratingBreakdown.map(
									(item) => (
										<div
											key={item.rating}
											className='flex items-center justify-between'
										>
											<span>{item.rating} Stars</span>
											<span>{item.count} reviews</span>
										</div>
									)
								)}
							</div>
						</div>
					)}

					{/* Subratings - Only show if they exist */}
					{tripAdvisorData?.stats.subratings &&
						tripAdvisorData.stats.subratings.length > 0 && (
							<div className='bg-white p-4 rounded-lg shadow'>
								<h3 className='text-lg font-semibold mb-3'>
									Detailed Ratings
								</h3>
								<div className='space-y-2'>
									{tripAdvisorData.stats.subratings.map(
										(rating) => (
											<div
												key={rating.name}
												className='flex items-center justify-between'
											>
												<span>{rating.name}</span>
												<span>
													{rating.value.toFixed(1)}
												</span>
											</div>
										)
									)}
								</div>
							</div>
						)}

					<ReviewsList
						reviews={tripAdvisorData?.reviews ?? []}
						platform='TripAdvisor'
						isLoading={isLoading}
					/>
				</div>

				{/* Google Reviews Section */}
				<div className='space-y-4'>
					<div className='grid gap-4 grid-cols-2'>
						<StatCard
							title='Google Rating'
							value={
								googleData?.stats?.averageRating?.toString() ??
								"0"
							}
							isLoading={isLoading}
							icon='ThumbsUp'
							backgroundColor='bg-[#444444]'
							textColor='text-white'
						/>
						<StatCard
							title='Total Reviews'
							value={
								googleData?.stats?.totalReviews?.toString() ??
								"0"
							}
							isLoading={isLoading}
							icon='UsersRound'
						/>
					</div>
					<ReviewsList
						reviews={googleData?.reviews ?? []}
						platform='Google'
						isLoading={isLoading}
					/>
				</div>
			</div>
		</div>
	);
}
