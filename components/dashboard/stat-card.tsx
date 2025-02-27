import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	UsersRound,
	Eye,
	Compass,
	ThumbsUp,
	Facebook,
	Instagram,
	Twitter,
	Music2,
} from "lucide-react";

interface StatCardProps {
	title: string;
	value: string;
	change?: string;
	isLoading?: boolean;
	tooltip?: string;
	textSize?: string;
	backgroundColor?: string;
	textColor?: string;
	content?: string;
	icon?: keyof typeof icons;
	format?: "percentage" | "number";
}

const icons = {
	UsersRound,
	Eye,
	Compass,
	ThumbsUp,
	Facebook,
	Instagram,
	Twitter,
	Music2,
	// Add other icons you use
} as const;

export function StatCard({
	title,
	value,
	change,
	isLoading = false,
	tooltip,
	textSize = "",
	backgroundColor = "",
	textColor = "",
	content = "",
	icon,
}: StatCardProps) {
	const changeValue = change ? parseFloat(change) : 0;
	const changeColor =
		changeValue > 0
			? "text-green-600"
			: changeValue < 0
			? "text-red-600"
			: "text-gray-600";

	const Icon = icon ? icons[icon] : undefined;

	return (
		<Card className={`${backgroundColor} ${textColor}`}>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className={`${textSize} flex items-center gap-2`}>
					{title}
					{tooltip && (
						<TooltipProvider>
							<Tooltip delayDuration={0}>
								<TooltipTrigger asChild>
									<div
										role='button'
										tabIndex={0}
										className='cursor-pointer focus:outline-none'
										onClick={(e) => e.preventDefault()}
										onTouchStart={(e) => e.preventDefault()}
									>
										<InfoIcon className='h-4 w-4 text-gray-500' />
									</div>
								</TooltipTrigger>
								<TooltipContent
									sideOffset={5}
									onPointerDownOutside={(e) =>
										e.preventDefault()
									}
								>
									<p>{tooltip}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</CardTitle>
				{Icon && <Icon className='h-6 w-6 text-gray-500' />}
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='animate-pulse'>
						<div className='h-4 bg-gray-200 rounded w-1/2'></div>
					</div>
				) : (
					<>
						<div className='text-2xl'>{value}</div>
						<p className={`text-xs ${changeColor}`}>{change}</p>
					</>
				)}
				{content && (
					<p className='text-xs text-muted-foreground'>{content}</p>
				)}
			</CardContent>
		</Card>
	);
}
