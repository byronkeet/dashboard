import { NextResponse } from "next/server";
import Airtable from "airtable";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_INDEMNITY_TABLE_NAME } =
	process.env;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_INDEMNITY_TABLE_NAME) {
	throw new Error("Missing Airtable environment variables.");
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const fromDate = searchParams.get("from");
		const toDate = searchParams.get("to");

		if (!fromDate || !toDate) {
			return NextResponse.json(
				{ success: false, message: "Date range is required" },
				{ status: 400 }
			);
		}

		// Log received dates
		console.log("Received dates:", { fromDate, toDate });

		const currentPeriodStart = new Date(fromDate);
		const currentPeriodEnd = new Date(toDate);

		// Calculate previous period by maintaining same day of month
		const previousPeriodStart = new Date(currentPeriodStart);
		previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);

		const previousPeriodEnd = new Date(currentPeriodEnd);
		previousPeriodEnd.setMonth(previousPeriodEnd.getMonth() - 1);

		// Format dates for Airtable formula
		const formatDate = (date: Date) => {
			const day = date.getDate();
			const month = date.toLocaleString("en-GB", { month: "short" });
			const year = date.getFullYear();
			return `${day} ${month}, ${year}`;
		};

		// Log formatted dates before query
		console.log("Formatted dates for query:", {
			currentPeriod: {
				start: formatDate(currentPeriodStart),
				end: formatDate(currentPeriodEnd),
			},
			previousPeriod: {
				start: formatDate(previousPeriodStart),
				end: formatDate(previousPeriodEnd),
			},
		});

		const formula = `OR(
			AND(
				IS_AFTER({Submitted On (UTC)}, '${formatDate(previousPeriodStart)}'),
				IS_BEFORE({Submitted On (UTC)}, '${formatDate(currentPeriodEnd)}')
			)
		)`;

		console.log("Airtable formula:", formula);

		const records = await base(AIRTABLE_INDEMNITY_TABLE_NAME as string)
			.select({
				filterByFormula: formula,
				sort: [{ field: "Submitted On (UTC)", direction: "desc" }],
			})
			.all();

		// Process and categorize the records
		const processedData = {
			currentPeriod: records
				.filter((record) => {
					const submittedDate = new Date(
						record.fields["Submitted On (UTC)"] as string
					);
					return (
						submittedDate >= currentPeriodStart &&
						submittedDate <= currentPeriodEnd
					);
				})
				.map((record) => ({
					id: record.id,
					...record.fields,
				})),
			previousPeriod: records
				.filter((record) => {
					const submittedDate = new Date(
						record.fields["Submitted On (UTC)"] as string
					);
					return (
						submittedDate >= previousPeriodStart &&
						submittedDate <= previousPeriodEnd
					);
				})
				.map((record) => ({
					id: record.id,
					...record.fields,
				})),
			metadata: {
				currentPeriod: {
					start: formatDate(currentPeriodStart),
					end: formatDate(currentPeriodEnd),
				},
				previousPeriod: {
					start: formatDate(previousPeriodStart),
					end: formatDate(previousPeriodEnd),
				},
			},
		};

		return NextResponse.json({ success: true, data: processedData });
	} catch (error) {
		console.error("Error fetching data from Airtable:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch data." },
			{ status: 500 }
		);
	}
}
