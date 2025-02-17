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
	Cell,
} from "recharts";
import { DepartmentMetric } from "@/lib/calculations/department-performance";
import { useEffect, useState } from "react";

interface DepartmentPerformanceChartProps {
	data: DepartmentMetric[];
	isLoading?: boolean;
}

const DEPARTMENT_COLORS = {
	Accommodation: "#B5854B",
	Food: "#444444",
	Facilities: "#000000",
	Housekeeping: "#666666",
	Staff: "#999999",
};

export function DepartmentPerformanceChart({
	data,
	isLoading = false,
}: DepartmentPerformanceChartProps) {
	// Update breakpoint to 1130px
	const [isCompact, setIsCompact] = useState(false);

	useEffect(() => {
		const checkWidth = () => {
			setIsCompact(window.innerWidth < 1130);
		};

		// Initial check
		checkWidth();

		// Add resize listener
		window.addEventListener("resize", checkWidth);
		return () => window.removeEventListener("resize", checkWidth);
	}, []);

	if (isLoading) {
		return (
			<Card className='col-span-1 md:col-span-4'>
				<CardHeader>
					<CardTitle>Department Performance</CardTitle>
				</CardHeader>
				<CardContent className='h-[350px]'>
					<div className='animate-pulse h-full bg-gray-100 rounded' />
				</CardContent>
			</Card>
		);
	}

	// Shorten names for compact view
	const compactData = data.map((item) => ({
		...item,
		name:
			item.name === "Accommodation"
				? "Accom"
				: item.name === "Facilities"
				? "Facil"
				: item.name === "Housekeeping"
				? "House"
				: item.name,
	}));

	return (
		<Card className='col-span-1 md:col-span-4'>
			<CardHeader>
				<CardTitle>Department Performance</CardTitle>
			</CardHeader>
			<CardContent className='h-[350px] -ml-6'>
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<BarChart
						data={isCompact ? compactData : data}
						margin={{
							top: 20,
							right: 20,
							left: 20,
							bottom: 20,
						}}
						barSize={15}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis
							dataKey='name'
							interval={0}
							angle={isCompact ? -45 : 0}
							textAnchor={isCompact ? "end" : "middle"}
							height={isCompact ? 80 : 30}
							tick={{ fontSize: isCompact ? 12 : 14 }}
						/>
						<YAxis
							domain={[0, 100]}
							ticks={[0, 20, 40, 60, 80, 100]}
							tickFormatter={(value) => `${value}%`}
						/>
						<Tooltip
							content={({ active, payload, label }) => {
								if (active && payload && payload.length) {
									// Show full department name in tooltip
									const fullName =
										data.find(
											(d) =>
												d.name.startsWith(label) ||
												label.startsWith(d.name)
										)?.name || label;

									return (
										<div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
											<p className='text-sm font-medium text-gray-900'>
												{fullName}
											</p>
											{payload.map((entry: any) => (
												<p
													key={entry.dataKey}
													className='text-sm'
													style={{
														color: entry.color,
													}}
												>
													{entry.dataKey === "current"
														? "Current"
														: "Previous"}
													: {entry.value.toFixed(1)}%
												</p>
											))}
										</div>
									);
								}
								return null;
							}}
						/>
						<Legend />
						<Bar
							dataKey='current'
							name='Current Period'
						>
							{data.map((entry) => (
								<Cell
									key={`cell-${entry.name}`}
									fill={
										DEPARTMENT_COLORS[
											entry.name as keyof typeof DEPARTMENT_COLORS
										]
									}
								/>
							))}
						</Bar>
						<Bar
							dataKey='previous'
							name='Previous Period'
						>
							{data.map((entry) => (
								<Cell
									key={`cell-${entry.name}`}
									fill={
										DEPARTMENT_COLORS[
											entry.name as keyof typeof DEPARTMENT_COLORS
										]
									}
									opacity={0.5}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
