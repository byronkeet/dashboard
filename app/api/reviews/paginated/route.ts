import { NextResponse } from "next/server";
import { base } from "@/lib/airtable";
import { AIRTABLE_REVIEW_TABLE_NAME } from "@/lib/constants";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const fromDate = searchParams.get("from");
		const toDate = searchParams.get("to");
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = 5;

		if (!fromDate || !toDate) {
			return NextResponse.json(
				{ success: false, message: "Date range is required" },
				{ status: 400 }
			);
		}

		// Format dates for Airtable formula
		const formatDate = (date: Date) => {
			const day = date.getDate();
			const month = date.toLocaleString("en-GB", { month: "short" });
			const year = date.getFullYear();
			return `${day} ${month}, ${year}`;
		};

		const start = new Date(fromDate);
		const end = new Date(toDate);

		console.log("Fetching reviews from:", start, "to:", end);

		// Calculate the previous period
		const periodDuration = end.getTime() - start.getTime();
		const previousStart = new Date(start.getTime() - periodDuration);
		const previousEnd = new Date(start);

		const formula = `OR(
			AND(IS_AFTER({Submitted On (UTC)}, '${formatDate(
				previousStart
			)}'), IS_BEFORE({Submitted On (UTC)}, '${formatDate(end)}'))
		)`;

		console.log("Airtable formula:", formula);

		const records = await base(AIRTABLE_REVIEW_TABLE_NAME as string)
			.select({
				filterByFormula: formula,
				sort: [{ field: "Submitted On (UTC)", direction: "desc" }],
			})
			.all();

		console.log("Total records fetched:", records.length);

		// Split records into current and previous periods
		const currentPeriodRecords = records
			.filter((record) => {
				const date = new Date(
					record.fields["Submitted On (UTC)"] as string
				);
				return date >= start && date <= end;
			})
			.map((record) => ({
				id: record.id,
				...record.fields,
			}));

		const previousPeriodRecords = records
			.filter((record) => {
				const date = new Date(
					record.fields["Submitted On (UTC)"] as string
				);
				return date >= previousStart && date < start;
			})
			.map((record) => ({
				id: record.id,
				...record.fields,
			}));

		console.log("Current period records:", currentPeriodRecords.length);
		console.log("Previous period records:", previousPeriodRecords.length);

		// Calculate pagination for current period records only
		const totalRecords = currentPeriodRecords.length;
		const totalPages = Math.ceil(totalRecords / pageSize);
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const paginatedRecords = currentPeriodRecords.slice(
			startIndex,
			endIndex
		);

		return NextResponse.json({
			success: true,
			reviews: paginatedRecords,
			currentPeriod: currentPeriodRecords,
			previousPeriod: previousPeriodRecords,
			totalPages,
			currentPage: page,
			totalRecords,
		});
	} catch (error) {
		console.error("Error fetching paginated reviews:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch reviews." },
			{ status: 500 }
		);
	}
}
