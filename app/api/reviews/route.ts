import { NextResponse } from "next/server";
import Airtable from "airtable";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_REVIEW_TABLE_NAME } =
	process.env;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_REVIEW_TABLE_NAME) {
	throw new Error("Missing Airtable environment variables.");
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const fromDate = searchParams.get("from");
		const toDate = searchParams.get("to");
		const compareFrom = searchParams.get("compareFrom");
		const compareTo = searchParams.get("compareTo");

		if (!fromDate || !toDate || !compareFrom || !compareTo) {
			return NextResponse.json(
				{ success: false, message: "Date ranges are required" },
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

		const currentPeriodStart = new Date(fromDate);
		const currentPeriodEnd = new Date(toDate);
		const previousPeriodStart = new Date(compareFrom);
		const previousPeriodEnd = new Date(compareTo);

		// Create Airtable formula for both periods
		const formula = `OR(
      AND(
        IS_AFTER({Submitted On (UTC)}, '${formatDate(currentPeriodStart)}'),
        IS_BEFORE({Submitted On (UTC)}, '${formatDate(currentPeriodEnd)}')
      ),
      AND(
        IS_AFTER({Submitted On (UTC)}, '${formatDate(previousPeriodStart)}'),
        IS_BEFORE({Submitted On (UTC)}, '${formatDate(previousPeriodEnd)}')
      )
    )`;

		console.log("Fetching reviews from Airtable...");
		console.log("Formula:", formula);

		const records = await base(AIRTABLE_REVIEW_TABLE_NAME)
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
						record.fields["Submitted On (UTC)"]
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
						record.fields["Submitted On (UTC)"]
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
