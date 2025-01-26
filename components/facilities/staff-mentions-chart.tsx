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
import { StaffMention } from "@/lib/calculations/stats";
import {
	calculatePercentageChange,
	formatPercentageChange,
} from "@/lib/calculations/stats";

interface StaffMentionsChartProps {
	data: StaffMention[];
	isLoading?: boolean;
}

export function StaffMentionsChart({
	data,
	isLoading = false,
}: StaffMentionsChartProps) {
	if (isLoading) {
		return (
			<Card className='col-span-1 md:col-span-12'>
				<CardHeader>
					<CardTitle>Staff Mentions</CardTitle>
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
				<CardTitle>Staff Mentions</CardTitle>
			</CardHeader>
			<CardContent className='h-[350px]'>
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' />
						<YAxis />
						<Tooltip
							content={({ active, payload, label }) => {
								if (active && payload && payload.length) {
									const mentionsChange =
										calculatePercentageChange(
											payload[0].payload.previousMentions,
											payload[0].payload.mentions
										);

									return (
										<div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
											<p className='text-sm font-medium text-gray-900'>
												{label}
											</p>
											<p className='text-sm'>
												Mentions: {payload[0].value}
												<span
													className={
														mentionsChange > 0
															? "text-green-600"
															: "text-red-600"
													}
												>
													(
													{formatPercentageChange(
														mentionsChange
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
							dataKey='mentions'
							fill='#000000'
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
