"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DualDateRangePicker } from "@/components/dashboard/dual-date-range-picker";
import { useState, useEffect } from "react";
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	TooltipProps,
	PieChart,
	Pie,
	Cell,
	Legend,
	LineChart,
	Line,
} from "recharts";
import { Review, PaginatedResponse } from "@/lib/types";
import { getReviews } from "@/lib/reviews";
import { cn } from "@/lib/utils";
import { useDateRange } from "@/lib/context/date-range-context";
import { useStatsData } from "@/lib/hooks/useStatsData";
import { StatCard } from "@/components/dashboard/stat-card";

const COLORS = ["#000000", "#666666", "#999999", "#CCCCCC"];

export default function Dashboard() {
	const { currentPeriod, comparablePeriod } = useDateRange();
	const [reviews, setReviews] = useState<any>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [indemnityData, setIndemnityData] = useState<{
		currentPeriod: any[];
		previousPeriod: any[];
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Use the custom hook for stats calculations
	const { guestStats, submissionStats, otsStats, error } = useStatsData(
		indemnityData,
		reviews
	);

	// Department performance data
	const departmentData = [
		{
			name: "Jan",
			accommodation: 400,
			facilities: 240,
			food: 320,
			staff: 280,
		},
		{
			name: "Feb",
			accommodation: 300,
			facilities: 139,
			food: 220,
			staff: 250,
		},
		{
			name: "Mar",
			accommodation: 200,
			facilities: 980,
			food: 420,
			staff: 310,
		},
		{
			name: "Apr",
			accommodation: 278,
			facilities: 390,
			food: 520,
			staff: 360,
		},
		{
			name: "May",
			accommodation: 189,
			facilities: 480,
			food: 380,
			staff: 290,
		},
	];

	// AI Sentiment data
	const sentimentData = [
		{ name: "Positive", value: 70 },
		{ name: "Neutral", value: 20 },
		{ name: "Negative", value: 10 },
	];

	// Add new useEffect for fetching review data
	useEffect(() => {
		const fetchReviewData = async () => {
			try {
				setIsLoading(true);
				const params = new URLSearchParams({
					from: currentPeriod.from.toISOString(),
					to: currentPeriod.to.toISOString(),
					compareFrom: comparablePeriod.from.toISOString(),
					compareTo: comparablePeriod.to.toISOString(),
				});

				const response = await fetch(`/api/reviews?${params}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const { data } = await response.json();
				console.log("Review data:", data);
				setReviews(data);
			} catch (error) {
				console.error("Error fetching review data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchReviewData();
	}, [currentPeriod, comparablePeriod]);

	useEffect(() => {
		const fetchIndemnityData = async () => {
			try {
				setIsLoading(true);
				const params = new URLSearchParams({
					from: currentPeriod.from.toISOString(),
					to: currentPeriod.to.toISOString(),
					compareFrom: comparablePeriod.from.toISOString(),
					compareTo: comparablePeriod.to.toISOString(),
				});

				const response = await fetch(`/api/indemnity?${params}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const { data } = await response.json();
				console.log("Response data:", data);

				setIndemnityData(data);
			} catch (error) {
				console.error("Error fetching indemnity data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchIndemnityData();
	}, [currentPeriod, comparablePeriod]);

	const loadReviews = async (page: number) => {
		setIsLoading(true);
		try {
			const response = await getReviews(page);
			setReviews(response.data);
			setTotalPages(response.metadata.totalPages);
		} catch (error) {
			console.error("Error loading reviews:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const renderPaginationButtons = () => {
		const buttons = [];
		const maxVisiblePages = 5;
		let startPage = Math.max(
			1,
			currentPage - Math.floor(maxVisiblePages / 2)
		);
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		// Previous button
		buttons.push(
			<button
				key='prev'
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={cn(
					"px-3 py-1 rounded-md",
					currentPage === 1
						? "opacity-50 cursor-not-allowed"
						: "hover:bg-gray-100"
				)}
			>
				Previous
			</button>
		);

		// First page
		if (startPage > 1) {
			buttons.push(
				<button
					key={1}
					onClick={() => handlePageChange(1)}
					className='px-3 py-1 rounded-md hover:bg-gray-100'
				>
					1
				</button>
			);
			if (startPage > 2) {
				buttons.push(<span key='dots1'>...</span>);
			}
		}

		// Page numbers
		for (let i = startPage; i <= endPage; i++) {
			buttons.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					className={cn(
						"px-3 py-1 rounded-md",
						currentPage === i
							? "bg-gray-900 text-white"
							: "hover:bg-gray-100"
					)}
				>
					{i}
				</button>
			);
		}

		// Last page
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				buttons.push(<span key='dots2'>...</span>);
			}
			buttons.push(
				<button
					key={totalPages}
					onClick={() => handlePageChange(totalPages)}
					className='px-3 py-1 rounded-md hover:bg-gray-100'
				>
					{totalPages}
				</button>
			);
		}

		// Next button
		buttons.push(
			<button
				key='next'
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={cn(
					"px-3 py-1 rounded-md",
					currentPage === totalPages
						? "opacity-50 cursor-not-allowed"
						: "hover:bg-gray-100"
				)}
			>
				Next
			</button>
		);

		return buttons;
	};

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
		<div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
			<div className='flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0'>
				<h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
					Dashboard
				</h2>
				<DualDateRangePicker />
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<StatCard
					title='Total Guests Check In'
					value={guestStats.value}
					change={guestStats.change}
					isLoading={isLoading}
				/>
				<StatCard
					title='Total Submissions'
					value={submissionStats.value}
					change={submissionStats.change}
					isLoading={isLoading}
				/>
				<StatCard
					title='Average OTS'
					value={otsStats.value}
					change={otsStats.change}
					isLoading={isLoading}
					tooltip='Overall Trip Score'
				/>
				{/* Add other stat cards */}
			</div>

			{/* Charts */}
			<div className='grid gap-4 grid-cols-1 md:grid-cols-7'>
				<Card className='col-span-1 md:col-span-4'>
					<CardHeader>
						<CardTitle>Department Performance</CardTitle>
					</CardHeader>
					<CardContent className='h-[350px]'>
						<ResponsiveContainer
							width='100%'
							height='100%'
						>
							<LineChart data={departmentData}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip content={<CustomTooltip />} />
								<Legend />
								<Line
									type='monotone'
									dataKey='accommodation'
									name='Accommodation'
									stroke='#000000'
									strokeWidth={2}
								/>
								<Line
									type='monotone'
									dataKey='facilities'
									name='Facilities'
									stroke='#666666'
									strokeWidth={2}
								/>
								<Line
									type='monotone'
									dataKey='food'
									name='Food'
									stroke='#999999'
									strokeWidth={2}
								/>
								<Line
									type='monotone'
									dataKey='staff'
									name='Staff'
									stroke='#CCCCCC'
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

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
									data={sentimentData}
									cx='50%'
									cy='50%'
									innerRadius={60}
									outerRadius={80}
									fill='#8884d8'
									paddingAngle={5}
									dataKey='value'
								>
									{sentimentData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Recent Reviews */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Reviews</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='relative w-full overflow-x-auto'>
						<table className='w-full text-sm text-left'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-4 py-3 font-medium'>
										Name
									</th>
									<th className='px-4 py-3 font-medium'>
										Review Date
									</th>
									<th className='px-4 py-3 font-medium'>
										OTS
									</th>
									<th className='px-4 py-3 font-medium'>
										WES
									</th>
									<th className='px-4 py-3 font-medium'>
										Would Recommend
									</th>
									<th className='px-4 py-3 font-medium'>
										Details
									</th>
								</tr>
							</thead>
							<tbody className='divide-y'>
								{isLoading ? (
									<tr>
										<td
											colSpan={6}
											className='px-4 py-8 text-center'
										>
											Loading reviews...
										</td>
									</tr>
								) : !reviews?.currentPeriod ||
								  reviews.currentPeriod.length === 0 ? (
									<tr>
										<td
											colSpan={6}
											className='px-4 py-8 text-center'
										>
											No reviews found
										</td>
									</tr>
								) : (
									reviews.currentPeriod.map((review) => (
										<tr
											key={review.id}
											className='hover:bg-gray-50'
										>
											<td className='px-4 py-3'>
												{review["Guest Name"]}
											</td>
											<td className='px-4 py-3'>
												{review["Submitted On (UTC)"]}
											</td>
											<td className='px-4 py-3'>
												{review["Overall Trip Experience"]}
											</td>
											<td className='px-4 py-3'>
												{review["Would Exceed Score"]}
											</td>
											<td className='px-4 py-3'>
												{review["Would Recommend"]
													? "Yes"
													: "No"}
											</td>
											<td className='px-4 py-3'>
												<button className='text-blue-600 hover:underline'>
													Details
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>

						{/* Pagination */}
						<div className='flex items-center justify-center space-x-2 py-4'>
							{renderPaginationButtons()}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
