import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { ActivityMetric } from "@/lib/calculations/stats";
import {
	calculatePercentageChange,
	formatPercentageChange,
} from "@/lib/calculations/stats";

interface ActivityCountsChartProps {
	data: ActivityMetric[];
	isLoading?: boolean;
}

export function ActivityCountsChart({
	data,
	isLoading = false,
}: ActivityCountsChartProps) {
	if (isLoading) {
		return (
			<Card className='col-span-1 md:col-span-12'>
				<CardHeader>
					<CardTitle>Activities Count</CardTitle>
				</CardHeader>
				<CardContent className='h-[350px]'>
					<div className='animate-pulse h-full bg-gray-100 rounded' />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='col-span-1 md:col-span-12'>
			<CardHeader>
				<CardTitle>Activities Count</CardTitle>
			</CardHeader>
			<CardContent className='h-[350px] sm:h-[400px] -ml-6'>
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<BarChart
						data={data}
						margin={{
							top: 20,
							right: 20,
							left: 20,
							bottom: 60,
						}}
						barSize={15}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis
							dataKey='name'
							angle={-45}
							textAnchor='end'
							height={60}
							interval={0}
							tick={{ fontSize: 12 }}
						/>
						<YAxis width={40} />
						<Tooltip
							content={({ active, payload, label }) => {
								if (active && payload && payload.length) {
									const item = payload[0].payload;
									const change = calculatePercentageChange(
										item.previousCount,
										item.count
									);

									return (
										<div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
											<p className='text-sm font-medium text-gray-900'>
												{label}
											</p>
											<p className='text-sm'>
												Count: {item.count}
												<span
													className={
														change > 0
															? "text-green-600"
															: "text-red-600"
													}
												>
													{" "}
													(
													{formatPercentageChange(
														change
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
						<Bar
							dataKey='count'
							fill='#000000'
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
