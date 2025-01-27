import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacilityComment } from "@/lib/calculations/stats";
import { formatDistanceToNow } from "date-fns";

interface FacilityCommentsProps {
	data: FacilityComment[];
	isLoading?: boolean;
}

export function FacilityComments({
	data,
	isLoading = false,
}: FacilityCommentsProps) {
	if (isLoading) {
		return (
			<Card className='col-span-1 md:col-span-12'>
				<CardHeader>
					<CardTitle>Facilities & Staff Comments</CardTitle>
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
		<Card className='col-span-1 md:col-span-12'>
			<CardHeader>
				<CardTitle>Facilities & Staff Comments</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4 h-[350px] overflow-y-auto pr-4'>
					{data.map((comment, index) => (
						<div
							key={index}
							className='space-y-2 pb-4 border-b last:border-0'
						>
							<div className='flex items-center gap-2'>
								<span
									className={`px-2 py-1 rounded-md text-xs ${
										comment.sentiment.toUpperCase() === "POSITIVE"
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{comment.sentiment.toUpperCase()}
								</span>
								<span className='text-sm font-medium'>
									{comment.name}
								</span>
								<span className='text-sm text-gray-500'>
									{formatDistanceToNow(
										new Date(comment.date),
										{ addSuffix: true }
									)}
								</span>
							</div>
							<p className='text-sm text-gray-600'>
								{comment.comment}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
