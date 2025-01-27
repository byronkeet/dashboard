"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { DualDateRangePicker } from "@/components/dashboard/dual-date-range-picker";
import { useDateRange } from "@/lib/context/date-range-context";
import { useReviews } from "@/lib/hooks/useReviews";
import { useState, useEffect, useMemo } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
} from "react-simple-maps";
import { countryCoordinates } from "./countryCoordinates";
import {
	LineChart,
	Line,
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
	BarChart,
	Bar,
} from "recharts";
import Papa from "papaparse";

// Constants for the social media cards
const socialMediaData = {
	facebook: { count: 2000, change: 2 },
	instagram: { count: 260000, change: -2 },
	twitter: { count: 200, change: -2 },
	tiktok: { count: 16458, change: 2 },
};

type SocialMediaSettings = {
	facebook: boolean;
	instagram: boolean;
	twitter: boolean;
	tiktok: boolean;
};

type GuestNationality = {
	country: string;
	count: number;
	coordinates: [number, number];
};

type GuestComment = {
	name: string;
	sentiment: string;
	comment: string;
};

const CHART_COLORS = ["#000000", "#666666", "#999999", "#CCCCCC"];
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function CommunicationPage() {
	const { currentPeriod, comparablePeriod, onDateRangeChange } =
		useDateRange();

	const {
		currentPeriod: currentPeriodReviews,
		previousPeriod: previousPeriodReviews,
		isLoading: reviewsLoading,
	} = useReviews(currentPeriod, comparablePeriod);

	const reviewsData = useMemo(
		() => ({
			currentPeriod: currentPeriodReviews,
			previousPeriod: previousPeriodReviews,
		}),
		[currentPeriodReviews, previousPeriodReviews]
	);

	const [socialSettings, setSocialSettings] = useState<SocialMediaSettings>({
		facebook: true,
		instagram: true,
		twitter: true,
		tiktok: true,
	});

	const [guestNationalities, setGuestNationalities] = useState<
		GuestNationality[]
	>([]);
	const [guestComments, setGuestComments] = useState<GuestComment[]>([]);
	const [tooltipContent, setTooltipContent] = useState<{
		content: string;
		position: { x: number; y: number };
	} | null>(null);

	// Load social media settings
	useEffect(() => {
		const savedSettings = localStorage.getItem("socialMediaSettings");
		if (savedSettings) {
			setSocialSettings(JSON.parse(savedSettings));
		}
	}, []);

	// Marketing source data
	const [marketingData] = useState([
		{ name: "Direct", value: 30 },
		{ name: "Social", value: 25 },
		{ name: "Email", value: 25 },
		{ name: "Other", value: 20 },
	]);

	// Communication ratings data
	const [ratingData] = useState([
		{ name: "Excellent", value: 45 },
		{ name: "Good", value: 35 },
		{ name: "Average", value: 15 },
		{ name: "Poor", value: 5 },
	]);

	// Top travel agents data
	const [agentData] = useState([
		{ name: "SGP Travel", bookings: 25 },
		{ name: "STA Travel", bookings: 18 },
		{ name: "Thompsons", bookings: 12 },
	]);

	// Load dummy data for now
	useEffect(() => {
		// Simulated nationality data
		const dummyNationalities: GuestNationality[] = [
			{
				country: "South Africa",
				count: 15,
				coordinates: countryCoordinates["South Africa"],
			},
			{
				country: "United States",
				count: 8,
				coordinates: countryCoordinates["United States"],
			},
			{
				country: "United Kingdom",
				count: 6,
				coordinates: countryCoordinates["United Kingdom"],
			},
			{
				country: "Germany",
				count: 4,
				coordinates: countryCoordinates["Germany"],
			},
		];
		setGuestNationalities(dummyNationalities);

		// Simulated comments
		const dummyComments: GuestComment[] = [
			{
				name: "John Smith",
				sentiment: "POSITIVE",
				comment:
					"Excellent communication throughout our stay. Staff was very responsive.",
			},
			{
				name: "Maria Garcia",
				sentiment: "NEGATIVE",
				comment:
					"Had some issues with the Wi-Fi connectivity during our stay.",
			},
		];
		setGuestComments(dummyComments);
	}, []);

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

	// Get enabled social media platforms
	const enabledSocialMedia = Object.entries(socialSettings)
		.filter(([_, enabled]) => enabled)
		.map(([platform]) => platform);

	return (
		<div className='flex-1 space-y-4 p-4 md:p-8 pt-6 pb-16 md:pb-8'>
			<div className='flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0'>
				<h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
					Marketing & Communications
				</h2>
				<div className='flex items-center space-x-2'>
					<DualDateRangePicker
						currentPeriod={currentPeriod}
						comparablePeriod={comparablePeriod}
						onUpdate={onDateRangeChange}
					/>
				</div>
			</div>

			{/* Social Media Stats */}
			<div
				className={`grid gap-4 grid-cols-1 md:grid-cols-${
					enabledSocialMedia.length || 1
				}`}
			>
				{socialSettings.facebook && (
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Facebook Followers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{socialMediaData.facebook.count}
							</div>
							<div
								className={`text-xs ${
									socialMediaData.facebook.change >= 0
										? "text-green-500"
										: "text-red-500"
								}`}
							>
								{socialMediaData.facebook.change >= 0
									? "+"
									: ""}
								{socialMediaData.facebook.change}%
							</div>
						</CardContent>
					</Card>
				)}

				{socialSettings.instagram && (
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Instagram Followers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{socialMediaData.instagram.count}
							</div>
							<div
								className={`text-xs ${
									socialMediaData.instagram.change >= 0
										? "text-green-500"
										: "text-red-500"
								}`}
							>
								{socialMediaData.instagram.change >= 0
									? "+"
									: ""}
								{socialMediaData.instagram.change}%
							</div>
						</CardContent>
					</Card>
				)}

				{socialSettings.twitter && (
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								X Followers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{socialMediaData.twitter.count}
							</div>
							<div
								className={`text-xs ${
									socialMediaData.twitter.change >= 0
										? "text-green-500"
										: "text-red-500"
								}`}
							>
								{socialMediaData.twitter.change >= 0 ? "+" : ""}
								{socialMediaData.twitter.change}%
							</div>
						</CardContent>
					</Card>
				)}

				{socialSettings.tiktok && (
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								TikTok Followers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{socialMediaData.tiktok.count}
							</div>
							<div
								className={`text-xs ${
									socialMediaData.tiktok.change >= 0
										? "text-green-500"
										: "text-red-500"
								}`}
							>
								{socialMediaData.tiktok.change >= 0 ? "+" : ""}
								{socialMediaData.tiktok.change}%
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Charts Row */}
			<div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
				{/* Marketing Source */}
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
									data={marketingData}
									cx='50%'
									cy='50%'
									innerRadius={60}
									outerRadius={80}
									fill='#8884d8'
									paddingAngle={5}
									dataKey='value'
								>
									{marketingData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												CHART_COLORS[
													index % CHART_COLORS.length
												]
											}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Communication Ratings */}
				<Card>
					<CardHeader>
						<CardTitle>Communication Ratings</CardTitle>
					</CardHeader>
					<CardContent className='h-[300px] md:h-[350px]'>
						<ResponsiveContainer
							width='100%'
							height='100%'
						>
							<BarChart data={ratingData}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<Bar
									dataKey='value'
									fill='#000000'
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Top Travel Agents */}
				<Card>
					<CardHeader>
						<CardTitle>Top Travel Agents</CardTitle>
					</CardHeader>
					<CardContent className='h-[300px] md:h-[350px]'>
						<ResponsiveContainer
							width='100%'
							height='100%'
						>
							<BarChart
								data={agentData}
								layout='vertical'
							>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis type='number' />
								<YAxis
									dataKey='name'
									type='category'
								/>
								<Tooltip />
								<Bar
									dataKey='bookings'
									fill='#000000'
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* World Map */}
			<Card>
				<CardHeader className='pb-0'>
					<CardTitle>Guest Nationality</CardTitle>
				</CardHeader>
				<CardContent className='p-0'>
					<div className='w-full aspect-[2/1] relative'>
						<ComposableMap
							projectionConfig={{
								scale: 130,
								center: [0, 0],
							}}
							width={980}
							height={450}
							style={{
								width: "100%",
								height: "100%",
								margin: "-20px",
							}}
						>
							<Geographies geography={geoUrl}>
								{({ geographies }) =>
									geographies.map((geo) => (
										<Geography
											key={geo.rsmKey}
											geography={geo}
											fill='#EAEAEC'
											stroke='#D6D6DA'
											strokeWidth={0.5}
										/>
									))
								}
							</Geographies>
							{guestNationalities.map(
								({ country, coordinates, count }) => (
									<Marker
										key={country}
										coordinates={coordinates}
										onMouseEnter={(evt) => {
											setTooltipContent({
												content: `${country}: ${count} guests`,
												position: {
													x: evt.clientX,
													y: evt.clientY,
												},
											});
										}}
										onMouseLeave={() =>
											setTooltipContent(null)
										}
									>
										<circle
											r={Math.sqrt(count) * 3}
											fill='#3182CE'
											stroke='#FFFFFF'
											strokeWidth={1}
											style={{
												cursor: "pointer",
												transition: "all 0.2s ease",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.fill =
													"#2C5282";
												e.currentTarget.style.r = (
													Math.sqrt(count) * 3.5
												).toString();
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.fill =
													"#3182CE";
												e.currentTarget.style.r = (
													Math.sqrt(count) * 3
												).toString();
											}}
										/>
									</Marker>
								)
							)}
						</ComposableMap>
						{tooltipContent && (
							<div
								style={{
									position: "fixed",
									left: tooltipContent.position.x + 10,
									top: tooltipContent.position.y - 40,
									transform: "translateX(-50%)",
									backgroundColor: "white",
									padding: "8px 12px",
									borderRadius: "4px",
									boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
									border: "1px solid #e2e8f0",
									zIndex: 1000,
									pointerEvents: "none",
								}}
							>
								<p className='text-sm font-medium'>
									{tooltipContent.content}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Guest Comments */}
			<Card>
				<CardHeader>
					<CardTitle>Guest Comments</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{guestComments.map((comment, index) => (
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
