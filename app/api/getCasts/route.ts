import { NextResponse } from 'next/server';
import { client } from '../neynar';

export async function POST(request: Request) {
  const { castsHashes } = await request.json();

  if (!Array.isArray(castsHashes)) {
    return NextResponse.json({ error: 'Invalid castsHashes' }, { status: 400 });
  }

  try {
    const casts = await client.fetchBulkCasts(castsHashes);
    return NextResponse.json(casts.result.casts);
  } catch (error) {
    console.error('Error fetching casts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}