import { NextResponse } from 'next/server';
import { client } from '../neynar';

export async function POST(request: Request) {
  const { fids } = await request.json();

  if (!Array.isArray(fids) || !fids.every(Number.isInteger)) {
    return NextResponse.json({ error: 'Invalid fids' }, { status: 400 });
  }

  try {
    const users = await client.fetchBulkUsers(fids);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}