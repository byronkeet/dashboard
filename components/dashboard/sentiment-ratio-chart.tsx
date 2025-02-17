import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import { SentimentRatio } from "@/lib/calculations/sentiment-ratio";

interface SentimentRatioChartProps {
	data: SentimentRatio[];
	isLoading?: boolean;
}

const COLORS = ["#B5854B", "#666666"];

export function SentimentRatioChart({
	data,
	isLoading = false,
}: SentimentRatioChartProps) {
	if (isLoading) {
		return (
			<Card className='col-span-1 md:col-span-3'>
				<CardHeader>
					<CardTitle>AI Sentiment Ratio</CardTitle>
				</CardHeader>
				<CardContent className='h-[350px]'>
					<div className='animate-pulse h-full bg-gray-100 rounded' />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='col-span-1 md:col-span-3'>
			<CardHeader>
				<CardTitle>AI Sentiment Ratio</CardTitle>
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
							labelLine={false}
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, value }) => `${name}: ${value}%`}
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
									const { name, value, previousValue } =
										payload[0].payload;
									return (
										<div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
											<p className='text-sm font-medium mb-1'>
												{name}
											</p>
											<p className='text-sm'>
												Current: {value}%
											</p>
											<p className='text-sm'>
												Previous: {previousValue}%
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
