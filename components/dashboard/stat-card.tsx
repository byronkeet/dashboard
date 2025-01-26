import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatCardProps {
	title: string;
	value: string;
	change: string;
	isLoading?: boolean;
	tooltip?: string;
	textSize?: string;
}

export function StatCard({
	title,
	value,
	change,
	isLoading = false,
	tooltip,
	textSize = ""
}: StatCardProps) {
	const changeValue = parseFloat(change);
	const changeColor =
		changeValue > 0
			? "text-green-600"
			: changeValue < 0
			? "text-red-600"
			: "text-gray-600";

	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className={`${textSize} flex items-center gap-2`}>
					{title}
					{tooltip && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<InfoIcon className='h-4 w-4 text-gray-500' />
								</TooltipTrigger>
								<TooltipContent>
									<p>{tooltip}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='animate-pulse'>
						<div className='h-4 bg-gray-200 rounded w-1/2'></div>
					</div>
				) : (
					<>
						<div className='text-2xl font-bold'>{value}</div>
						<p className={`text-xs ${changeColor}`}>{change}</p>
					</>
				)}
			</CardContent>
		</Card>
	);
}
