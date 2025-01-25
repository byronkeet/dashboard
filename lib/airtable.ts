 import Airtable from "airtable";

 const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

 if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
		throw new Error("Missing Airtable environment variables.");
 }

 export const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
		AIRTABLE_BASE_ID
 );