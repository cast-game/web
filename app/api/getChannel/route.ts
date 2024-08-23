import { NextResponse } from 'next/server';
import { client } from '../neynar';

export async function POST(request: Request) {
  const { channelId } = await request.json();

  if (typeof channelId !== 'string' || !channelId) {
    return NextResponse.json({ error: 'Invalid channelId' }, { status: 400 });
  }

  try {
    const channel = await client.fetchBulkChannels([channelId]);
    return NextResponse.json(channel.channels[0]);
  } catch (error) {
    console.error('Error fetching channel:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}