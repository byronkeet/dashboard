"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { useState } from "react";
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	TooltipProps,
	BarChart,
	Bar,
} from "recharts";

type StaffMention = {
	name: string;
	count: number;
};

type FacilityComment = {
	name: string;
	sentiment: "POSITIVE" | "NEGATIVE";
	comment: string;
	date: string;
};

export default function FacilitiesStaffPage() {
	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: new Date(),
		to: new Date(),
	});

	const [staffMentions] = useState<StaffMention[]>([
		{ name: "Eve", count: 11 },
		{ name: "Tom", count: 9 },
		{ name: "Sipho", count: 6 },
		{ name: "Susan", count: 7 },
		{ name: "Lucky", count: 6 },
	]);

	const [facilityComments] = useState<FacilityComment[]>([
		{
			name: "Christan Bilney",
			sentiment: "NEGATIVE",
			comment:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
			date: "2 days ago",
		},
		{
			name: "Hady Vanetti",
			sentiment: "POSITIVE",
			comment:
				"Aliquam vel nibh iaculis, ornare purus sit amet, euismod dui. Cras sed tristique neque. Cras ornare dui lorem, vel rhoncus elit venenatis sit amet.",
			date: "4 days ago",
		},
	]);

	const CustomTooltip = ({
		active,
		payload,
		label,
	}: TooltipProps<number, string>) => {
		if (active && payload && payload.length) {
			return (
				<div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
					<p className='text-sm font-medium text-gray-900'>{label}</p>
					{payload.map((entry) => (
						<p
							key={entry.name}
							className='text-sm'
							style={{ color: entry.color }}
						>
							{entry.name}: {entry.value}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	return (
		<div className='flex-1 space-y-4 p-4 md:p-8 pt-6 pb-16 md:pb-8'>
			<div className='flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0'>
				<h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
					Facilities & Staff Dashboard
				</h2>
				<DateRangePicker onRangeChange={setDateRange} />
			</div>

			<div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
				<Card>
					<CardHeader>
						<CardTitle>Average Room Rating</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>90%</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Average Facility Rating</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>90%</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Average Food Rating</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>90%</div>
					</CardContent>
				</Card>
			</div>

			<div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
				<Card>
					<CardHeader>
						<CardTitle>Average Housekeeping Rating</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>70%</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Average Staff Rating</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>76%</div>
					</CardContent>
				</Card>

				<Card className='bg-gray-900 text-white'>
					<CardHeader>
						<CardTitle>Ave Overall Score</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>90%</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Staff Mentions</CardTitle>
				</CardHeader>
				<CardContent className='h-[350px]'>
					<ResponsiveContainer
						width='100%'
						height='100%'
					>
						<BarChart data={staffMentions}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='name' />
							<YAxis />
							<Tooltip content={<CustomTooltip />} />
							<Bar
								dataKey='count'
								fill='#000000'
							/>
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Facilities & Staff Comments</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4 h-[350px] overflow-y-auto pr-4'>
						{facilityComments.map((comment, index) => (
							<div
								key={index}
								className='space-y-2 pb-4 border-b last:border-0'
							>
								<div className='flex items-center gap-2'>
									<span
										className={`px-2 py-1 rounded-md text-xs ${
											comment.sentiment === "POSITIVE"
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{comment.sentiment}
									</span>
									<span className='text-sm font-medium'>
										{comment.name}
									</span>
									<span className='text-sm text-gray-500'>
										{comment.date}
									</span>
								</div>
								<p className='text-sm text-gray-600'>
									{comment.comment}
								</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
