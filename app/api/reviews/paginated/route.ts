import { NextResponse } from "next/server";
import { base } from "@/lib/airtable";
import { AIRTABLE_REVIEW_TABLE_NAME } from "@/lib/constants";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const fromDate = searchParams.get("from");
		const toDate = searchParams.get("to");
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = 10;

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

		// Create Airtable formula for date range
		const formula = `AND(
      IS_AFTER({Submitted On (UTC)}, '${formatDate(start)}'),
      IS_BEFORE({Submitted On (UTC)}, '${formatDate(end)}')
    )`;

		// Fetch records for the date range
		const records = await base(AIRTABLE_REVIEW_TABLE_NAME)
			.select({
				filterByFormula: formula,
				sort: [{ field: "Submitted On (UTC)", direction: "desc" }],
			})
			.all();

		// Calculate pagination
		const totalRecords = records.length;
		const totalPages = Math.ceil(totalRecords / pageSize);
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;

		// Get records for current page
		const paginatedRecords = records
			.slice(startIndex, endIndex)
			.map((record) => ({
				id: record.id,
				"Full Name": record.fields["Full Name"],
				"Submitted On (UTC)": record.fields["Submitted On (UTC)"],
				"Overall Trip Experience":
					record.fields["Overall Trip Experience"],
				"Overall Wildlife Experience":
					record.fields["Overall Wildlife Experience"],
				"Would you recommend Tuludi to your friends?":
					record.fields[
						"Would you recommend Tuludi to your friends?"
					],
				...record.fields, // Include all fields for the details view
			}));

		return NextResponse.json({
			success: true,
			reviews: paginatedRecords,
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
