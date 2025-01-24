import { NextResponse } from 'next/server';
import { getIndemnities } from '@/lib/airtable';

export async function GET() {
  try {
    const indemnities = await getIndemnities();
    return NextResponse.json(indemnities);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch indemnities' },
      { status: 500 }
    );
  }
}