import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import { WildlifeMetric } from "@/lib/calculations/stats";
import {
	calculatePercentageChange,
	formatPercentageChange,
} from "@/lib/calculations/stats";

interface WildlifeSightingsChartProps {
	data: WildlifeMetric[];
	isLoading?: boolean;
}

const COLORS = ["#000000", "#666666", "#999999", "#CCCCCC"];

export function WildlifeSightingsChart({
	data,
	isLoading = false,
}: WildlifeSightingsChartProps) {
	if (isLoading) {
		return (
			<Card className='col-span-1 md:col-span-6'>
				<CardHeader>
					<CardTitle>Wildlife Sightings</CardTitle>
				</CardHeader>
				<CardContent className='h-[350px]'>
					<div className='animate-pulse h-full bg-gray-100 rounded' />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='col-span-1 md:col-span-6'>
			<CardHeader>
				<CardTitle>Wildlife Sightings</CardTitle>
			</CardHeader>
			<CardContent className='h-[350px]'>
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<PieChart>
						<Pie
							data={data}
							cx='50%'
							cy='50%'
							outerRadius={130}
							fill='#8884d8'
							dataKey='value'
							nameKey='name'
						>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									const item = payload[0].payload;
									const change = calculatePercentageChange(
										item.previousValue,
										item.value
									);

									return (
										<div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
											<p className='text-sm font-medium text-gray-900'>
												{item.name}
											</p>
											<p className='text-sm'>
												Count: {item.value}
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
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
