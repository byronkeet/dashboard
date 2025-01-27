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
import { CommunicationRating } from "@/lib/calculations/stats";

interface CommunicationRatingsChartProps {
	data: CommunicationRating[];
	isLoading?: boolean;
}

export function CommunicationRatingsChart({
	data,
	isLoading = false,
}: CommunicationRatingsChartProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Communication Rating</CardTitle>
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
				<CardTitle>Communication Rating</CardTitle>
			</CardHeader>
			<CardContent className='h-[300px] md:h-[350px]'>
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' />
						<YAxis domain={[0, 5]} />
						<Tooltip
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									const item = payload[0].payload;
									return (
										<div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
											<p className='text-sm font-medium text-gray-900'>
												{item.name}
											</p>
											<p className='text-sm'>
												Average Rating:{" "}
												{item.value.toFixed(2)}/5
											</p>
											<p className='text-sm text-gray-600'>
												Based on {item.count} reviews
											</p>
										</div>
									);
								}
								return null;
							}}
						/>
						<Bar
							dataKey='value'
							fill='#000000'
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
