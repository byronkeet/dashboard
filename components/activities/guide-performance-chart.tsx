import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { GuideMetric } from "@/lib/calculations/stats";
import {
	calculatePercentageChange,
	formatPercentageChange,
} from "@/lib/calculations/stats";

interface GuidePerformanceChartProps {
	data: GuideMetric[];
	isLoading?: boolean;
}

export function GuidePerformanceChart({
	data,
	isLoading = false,
}: GuidePerformanceChartProps) {
	if (isLoading) {
		return (
			<Card className='col-span-1 md:col-span-8'>
				<CardHeader>
					<CardTitle>Guide Ratings vs Trips Taken</CardTitle>
				</CardHeader>
				<CardContent className='h-[350px]'>
					<div className='animate-pulse h-full bg-gray-100 rounded' />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='col-span-1 md:col-span-8'>
			<CardHeader>
				<CardTitle>Guide Ratings vs Trips Taken</CardTitle>
			</CardHeader>
			<CardContent className='h-[350px]'>
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<BarChart
						data={data}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' />
						<YAxis
							yAxisId='rating'
							domain={[0, 5]}
						/>
						<YAxis
							yAxisId='trips'
							orientation='right'
						/>
						<Tooltip
							content={({ active, payload, label }) => {
								if (active && payload && payload.length) {
									const ratingChange =
										calculatePercentageChange(
											payload[0].payload.previousRating,
											payload[0].payload.rating
										);
									const tripsChange =
										calculatePercentageChange(
											payload[0].payload.previousTrips,
											payload[0].payload.trips
										);

									return (
										<div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
											<p className='text-sm font-medium text-gray-900'>
												{label}
											</p>
											<p className='text-sm'>
												Rating:{" "}
												{payload[0].value.toFixed(1)}/5{" "}
												<span
													className={
														ratingChange > 0
															? "text-green-600"
															: "text-red-600"
													}
												>
													(
													{formatPercentageChange(
														ratingChange
													)}
													)
												</span>
											</p>
											<p className='text-sm'>
												Trips: {payload[1].value}{" "}
												<span
													className={
														tripsChange > 0
															? "text-green-600"
															: "text-red-600"
													}
												>
													(
													{formatPercentageChange(
														tripsChange
													)}
													)
												</span>
											</p>
										</div>
									);
								}
								return null;
							}}
						/>
						<Legend />
						<Bar
							yAxisId='rating'
							dataKey='rating'
							name='Rating'
							fill='#000000'
						/>
						<Bar
							yAxisId='trips'
							dataKey='trips'
							name='Trips'
							fill='#666666'
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
