import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface ActivityComment {
	name: string;
	sentiment: "POSITIVE" | "NEGATIVE";
	comment: string;
}

interface ActivityCommentsProps {
	data: ActivityComment[];
	isLoading?: boolean;
}

export function ActivityComments({
	data,
	isLoading = false,
}: ActivityCommentsProps) {
	if (isLoading) {
		return (
			<Card className='col-span-1 md:col-span-6'>
				<CardHeader>
					<CardTitle>Activity Comments</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4 h-[350px]'>
						<div className='animate-pulse space-y-4'>
							{[...Array(3)].map((_, i) => (
								<div
									key={i}
									className='space-y-2'
								>
									<div className='flex gap-2'>
										<div className='h-6 bg-gray-200 rounded w-20' />
										<div className='h-6 bg-gray-200 rounded w-32' />
									</div>
									<div className='h-16 bg-gray-200 rounded w-full' />
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='col-span-1 md:col-span-6'>
			<CardHeader>
				<CardTitle>Activity Comments</CardTitle>
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
										comment.sentiment === "POSITIVE"
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{comment.sentiment}
								</span>
								<span className='text-sm font-medium'>
									{comment.name}
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
