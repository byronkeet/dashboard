import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import { MarketingSource } from "@/lib/calculations/stats";
import {
	calculatePercentageChange,
	formatPercentageChange,
} from "@/lib/calculations/stats";

const COLORS = ["#000000", "#666666", "#999999", "#CCCCCC"];

interface MarketingSourceChartProps {
	data: MarketingSource[];
	isLoading?: boolean;
}

export function MarketingSourceChart({
	data,
	isLoading = false,
}: MarketingSourceChartProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Marketing Source</CardTitle>
				</CardHeader>
				<CardContent className='h-[300px] md:h-[350px]'>
					<div className='animate-pulse h-full bg-gray-100 rounded' />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Marketing Source</CardTitle>
			</CardHeader>
			<CardContent className='h-[300px] md:h-[350px]'>
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<PieChart>
						<Pie
							data={data}
							cx='50%'
							cy='50%'
							innerRadius={60}
							outerRadius={80}
							fill='#8884d8'
							paddingAngle={5}
							dataKey='value'
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
												Current: {item.value.toFixed(1)}
												% ({item.count} reviews)
												<span
													className={
														change > 0
															? "text-green-600 ml-2"
															: "text-red-600 ml-2"
													}
												>
													(
													{formatPercentageChange(
														change
													)}
													)
												</span>
											</p>
											<p className='text-sm text-gray-600'>
												Previous:{" "}
												{item.previousValue.toFixed(1)}%
												({item.previousCount} reviews)
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
