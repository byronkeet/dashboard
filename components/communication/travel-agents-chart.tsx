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
import { TravelAgent } from "@/lib/calculations/stats";

interface TravelAgentsChartProps {
	data: TravelAgent[];
	isLoading?: boolean;
}

export function TravelAgentsChart({
	data,
	isLoading = false,
}: TravelAgentsChartProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Top Travel Agents</CardTitle>
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
				<CardTitle>Top Travel Agents</CardTitle>
			</CardHeader>
			<CardContent className='h-[300px] md:h-[350px] -ml-6'>
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<BarChart
						data={data}
						layout='vertical'
						margin={{
							top: 20,
							right: 20,
							bottom: 20,
							left: 20,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis type='number' />
						<YAxis
							dataKey='name'
							type='category'
							width={60}
							style={{
								fontSize: "12px",
							}}
						/>
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
												Bookings: {item.bookings}
											</p>
										</div>
									);
								}
								return null;
							}}
						/>
						<Bar
							dataKey='bookings'
							fill='#000000'
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
