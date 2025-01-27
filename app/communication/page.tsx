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
import {
	calculateMarketingSources,
	calculateCommunicationRatings,
	calculateTopTravelAgents,
	calculateGuestNationalities,
	calculateGuestComments,
} from "@/lib/calculations/stats";
import { MarketingSourceChart } from "@/components/communication/marketing-source-chart";
import { CommunicationRatingsChart } from "@/components/communication/communication-ratings-chart";
import { TravelAgentsChart } from "@/components/communication/travel-agents-chart";
import { GuestNationalityChart } from "@/components/communication/guest-nationality-chart";
import { GuestComments } from "@/components/communication/guest-comments";

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

	const guestCommentsData = useMemo(
		() => calculateGuestComments(reviewsData),
		[reviewsData]
	);

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

	// First calculate the number of enabled social media platforms
	const enabledCount = Object.values(socialSettings).filter(Boolean).length;

	// Helper function to determine grid columns
	const getGridCols = (count: number) => {
		switch (count) {
			case 1:
				return "md:grid-cols-1";
			case 2:
				return "md:grid-cols-2";
			case 3:
				return "md:grid-cols-3";
			default:
				return "md:grid-cols-4";
		}
	};

	const marketingSourceData = calculateMarketingSources(reviewsData);
	const communicationRatingsData = calculateCommunicationRatings(reviewsData);
	const travelAgentsData = calculateTopTravelAgents(reviewsData);
	const guestNationalityData = calculateGuestNationalities(reviewsData);

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
				className={`grid gap-4 grid-cols-1 ${getGridCols(
					enabledCount
				)}`}
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
				<MarketingSourceChart
					data={marketingSourceData}
					isLoading={reviewsLoading}
				/>

				{/* Communication Ratings */}
				<CommunicationRatingsChart
					data={communicationRatingsData}
					isLoading={reviewsLoading}
				/>

				{/* Top Travel Agents */}
				<TravelAgentsChart
					data={travelAgentsData}
					isLoading={reviewsLoading}
				/>
			</div>

			{/* World Map */}
			<GuestNationalityChart
				data={guestNationalityData}
				isLoading={reviewsLoading}
			/>

			{/* Guest Comments */}
			<GuestComments
				data={guestCommentsData}
				isLoading={reviewsLoading}
			/>
		</div>
	);
}
