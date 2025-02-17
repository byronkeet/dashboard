import { ExternalReview } from "@/lib/types/external-reviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewsListProps {
	reviews: ExternalReview[];
	platform: "TripAdvisor" | "Google";
	isLoading?: boolean;
}

export function ReviewsList({
	reviews,
	platform,
	isLoading = false,
}: ReviewsListProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{platform} Reviews</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='animate-pulse space-y-4'>
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className='space-y-2'
							>
								<div className='h-4 bg-gray-100 rounded w-1/4' />
								<div className='h-4 bg-gray-100 rounded w-full' />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{platform} Reviews</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4 h-[600px] overflow-y-auto pr-4'>
					{reviews.map((review) => (
						<div
							key={review.id}
							className='space-y-2 pb-4 border-b last:border-0'
						>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<span className='text-sm font-medium'>
										{review.reviewer}
									</span>
									<span className='text-sm text-gray-500'>
										{formatDistanceToNow(
											new Date(review.date),
											{ addSuffix: true }
										)}
									</span>
								</div>
								<div className='flex items-center gap-1'>
									<Star className='h-4 w-4 fill-[#B5854B] text-[#B5854B]' />
									<span className='text-sm font-medium'>
										{review.rating}
									</span>
								</div>
							</div>
							{review.title && (
								<p className='text-sm font-medium'>
									{review.title}
								</p>
							)}
							<p className='text-sm text-gray-600'>
								{review.text}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
