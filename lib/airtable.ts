import { z } from 'zod';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const reviewSchema = z.object({
  id: z.string(),
  // Add more fields based on your Airtable schema
});

const indemnitySchema = z.object({
  id: z.string(),
  // Add more fields based on your Airtable schema
});

export type Review = z.infer<typeof reviewSchema>;
export type Indemnity = z.infer<typeof indemnitySchema>;

async function fetchAirtableData(table: string) {
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${table} data`);
  }

  return response.json();
}

export async function getReviews() {
  const data = await fetchAirtableData('Review');
  return data.records.map((record: any) => ({
    id: record.id,
    ...record.fields,
  }));
}

export async function getIndemnities() {
  const data = await fetchAirtableData('Indemnity');
  return data.records.map((record: any) => ({
    id: record.id,
    ...record.fields,
  }));
}