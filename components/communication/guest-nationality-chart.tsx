import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
} from "react-simple-maps";
import { GuestNationality } from "@/lib/calculations/stats";
import { useState, useRef } from "react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GuestNationalityChartProps {
	data: GuestNationality[];
	isLoading?: boolean;
}

type TooltipContent = {
	content: string;
	position: {
		x: number;
		y: number;
	};
	markerCoordinates: [number, number];
} | null;

export function GuestNationalityChart({
	data,
	isLoading = false,
}: GuestNationalityChartProps) {
	const [tooltipContent, setTooltipContent] = useState<TooltipContent>(null);
	const mapRef = useRef<HTMLDivElement>(null);

	if (isLoading) {
		return (
			<Card>
				<CardHeader className='pb-0'>
					<CardTitle>Guest Nationality</CardTitle>
				</CardHeader>
				<CardContent className='p-0'>
					<div className='w-full aspect-[2/1] relative'>
						<div className='animate-pulse h-full bg-gray-100 rounded' />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className='pb-0'>
				<CardTitle>Guest Nationality</CardTitle>
			</CardHeader>
			<CardContent className='p-0'>
				<div
					className='w-full aspect-[2/1] relative'
					ref={mapRef}
				>
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
						{data.map(({ country, coordinates, count }) => (
							<Marker
								key={country}
								coordinates={coordinates}
								onMouseEnter={(evt) => {
									const rect =
										mapRef.current?.getBoundingClientRect();
									if (!rect) return;

									const x = evt.clientX - rect.left;
									const y = evt.clientY - rect.top;

									setTooltipContent({
										content: `${country}: ${count} guests`,
										position: { x, y },
										markerCoordinates: coordinates,
									});
								}}
								onTouchStart={(evt) => {
									evt.preventDefault();
									const rect =
										mapRef.current?.getBoundingClientRect();
									if (!rect) return;

									const touch = evt.touches[0];
									const x = touch.clientX - rect.left;
									const y = touch.clientY - rect.top;

									setTooltipContent({
										content: `${country}: ${count} guests`,
										position: { x, y },
										markerCoordinates: coordinates,
									});
								}}
								onMouseLeave={() => setTooltipContent(null)}
								onTouchEnd={() => setTooltipContent(null)}
							>
								<circle
									r={Math.max(Math.sqrt(count) * 3, 6)}
									fill='#B5854B'
									stroke='#FFFFFF'
									strokeWidth={1}
									style={{
										cursor: "pointer",
										transition: "all 0.2s ease",
										touchAction: "none",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.fill = "#666666";
										e.currentTarget.setAttribute(
											"r",
											Math.max(
												Math.sqrt(count) * 3.5,
												8
											).toString()
										);
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.fill = "#B5854B";
										e.currentTarget.setAttribute(
											"r",
											Math.max(
												Math.sqrt(count) * 3,
												6
											).toString()
										);
									}}
								/>
							</Marker>
						))}
					</ComposableMap>
					{tooltipContent && (
						<div
							style={{
								position: "absolute",
								left: `${tooltipContent.position.x}px`,
								top: `${tooltipContent.position.y - 40}px`,
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
	);
}
