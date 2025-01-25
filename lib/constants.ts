export const AIRTABLE_REVIEW_TABLE_NAME =
	process.env.AIRTABLE_REVIEW_TABLE_NAME;

if (!AIRTABLE_REVIEW_TABLE_NAME) {
	throw new Error("Missing AIRTABLE_REVIEW_TABLE_NAME environment variable.");
}
