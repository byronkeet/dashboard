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

const WILDLIFE_CATEGORIES = [
	"Lion",
	"Cheetah",
	"Leopard",
	"Elephant",
	"Buffalo",
	"Other",
] as const;
const COLORS = [
	"#000000",
	"#444444",
	"#666666",
	"#777777",
	"#999999",
	"#DDDDDD",
];

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

	// Consolidate data into specified categories
	const consolidatedData = WILDLIFE_CATEGORIES.map((category) => {
		if (category === "Other") {
			// Sum up all values that aren't in the main categories
			const otherSum = data.reduce((acc, item) => {
				if (!WILDLIFE_CATEGORIES.includes(item.name as any)) {
					return acc + item.value;
				}
				return acc;
			}, 0);

			const otherPreviousSum = data.reduce((acc, item) => {
				if (!WILDLIFE_CATEGORIES.includes(item.name as any)) {
					return acc + (item.previousValue || 0);
				}
				return acc;
			}, 0);

			return {
				name: "Other",
				value: otherSum,
				previousValue: otherPreviousSum,
			};
		}

		// Find the matching category in the original data
		const categoryData = data.find((item) => item.name === category);
		return {
			name: category,
			value: categoryData?.value || 0,
			previousValue: categoryData?.previousValue || 0,
		};
	}).filter((item) => item.value > 0); // Only show categories with values

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
							data={consolidatedData}
							cx='50%'
							cy='50%'
							outerRadius={130}
							fill='#8884d8'
							dataKey='value'
							nameKey='name'
						>
							{consolidatedData.map((entry, index) => (
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
