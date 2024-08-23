import { NextResponse } from 'next/server';
import { init, fetchQuery } from '@airstack/airstack-react';

if (!process.env.AIRSTACK_API_KEY) {
  throw new Error("Please set AIRSTACK_API_KEY in your environment variables");
}
init(process.env.AIRSTACK_API_KEY);

export async function POST(request: Request) {
  const { castsHashes } = await request.json();

  if (!Array.isArray(castsHashes)) {
    return NextResponse.json({ error: 'Invalid castsHashes' }, { status: 400 });
  }

  try {
    const query = await fetchQuery(`{
      FarcasterCasts(
        input: {filter: {hash: {_in: ${JSON.stringify(castsHashes)}}}, blockchain: ALL}
      ) {
        Cast {
          hash
          castValue {
            formattedValue
          }
        }
      }
    }`);
    
    const output = query.data.FarcasterCasts.Cast.map((cast: any) => {
      const score =
        cast.castValue.formattedValue > 10
          ? Math.ceil(cast.castValue.formattedValue)
          : cast.castValue.formattedValue.toFixed(2);
  
      return {
        hash: cast.hash,
        score,
      };
    });

    return NextResponse.json(output);
  } catch (error) {
    console.error('Error fetching casts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}