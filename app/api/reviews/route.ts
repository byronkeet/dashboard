import { NextResponse } from 'next/server';
import { getReviews } from '@/lib/airtable';

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}