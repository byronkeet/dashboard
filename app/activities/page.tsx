"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DualDateRangePicker } from "@/components/dashboard/dual-date-range-picker";
import { useState, useMemo } from "react";
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	TooltipProps,
	PieChart,
	Pie,
	Cell,
	Legend,
	BarChart,
	Bar,
} from "recharts";
import { useDateRange } from "@/lib/context/date-range-context";
import { useReviews } from "@/lib/hooks/useReviews";
import {
	calculateWESStats,
	calculateGuideRatingStats,
	calculateGuideMetrics,
	calculateWildlifeSightings,
} from "@/lib/calculations/stats";
import { StatCard } from "@/components/dashboard/stat-card";
import { GuidePerformanceChart } from "@/components/activities/guide-performance-chart";
import { WildlifeSightingsChart } from "@/components/activities/wildlife-sightings-chart";

type GuideData = {
	name: string;
	rating: number;
	trips: number;
};

type ActivityCount = {
	name: string;
	count: number;
};

type WildlifeSighting = {
	name: string;
	value: number;
};

type ActivityComment = {
	name: string;
	sentiment: "POSITIVE" | "NEGATIVE";
	comment: string;
};

const WILDLIFE_COLORS = ["#000000", "#666666", "#999999", "#CCCCCC"];

export default function ActivitiesPage() {
	const { currentPeriod, comparablePeriod, onDateRangeChange } =
		useDateRange();

	const {
		currentPeriod: currentPeriodReviews,
		previousPeriod: previousPeriodReviews,
		isLoading: reviewsLoading,
	} = useReviews(currentPeriod);

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

	const [guideData] = useState<GuideData[]>([
		{ name: "Amos", rating: 10, trips: 6 },
		{ name: "KG", rating: 9, trips: 12 },
		{ name: "Ness", rating: 6, trips: 10 },
		{ name: "Tony", rating: 7, trips: 7 },
	]);

	const [activityCounts] = useState<ActivityCount[]>([
		{ name: "Game Drive", count: 10 },
		{ name: "Mokoro", count: 9 },
		{ name: "Guided Walk", count: 6 },
		{ name: "Ranger Experience", count: 2 },
		{ name: "Boat Trip", count: 1 },
		{ name: "Village Experience", count: 1 },
	]);

	const [wildlifeSightings] = useState<WildlifeSighting[]>([
		{ name: "Lion", value: 25 },
		{ name: "Elephant", value: 35 },
		{ name: "Buffalo", value: 25 },
		{ name: "Leopard", value: 15 },
	]);

	const [activityComments] = useState<ActivityComment[]>([
		{
			name: "Christan Bilney",
			sentiment: "NEGATIVE",
			comment:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		},
		{
			name: "Hady Vanetti",
			sentiment: "POSITIVE",
			comment:
				"Aliquam vel nibh iaculis, ornare purus sit amet, euismod dui. Cras sed tristique neque. Cras ornare dui lorem, vel rhoncus elit venenatis sit amet.",
		},
	]);

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
				<Card className='col-span-1 md:col-span-6'>
					<CardHeader>
						<CardTitle>Activity Comments</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4 h-[350px] overflow-y-auto pr-4'>
							{activityComments.map((comment, index) => (
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

				{/* Third row */}
				<Card className='col-span-1 md:col-span-12'>
					<CardHeader>
						<CardTitle>Activities Count</CardTitle>
					</CardHeader>
					<CardContent className='h-[350px]'>
						<ResponsiveContainer
							width='100%'
							height='100%'
						>
							<BarChart data={activityCounts}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<Bar
									dataKey='count'
									fill='#000000'
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
