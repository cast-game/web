import { NeynarV2APIClient } from "@neynar/nodejs-sdk/build/neynar-api/v2";

if (!process.env.NEYNAR_API_KEY) {
  throw new Error('Please set NEYNAR_API_KEY in your environment variables');
}

export const client = new NeynarV2APIClient(process.env.NEYNAR_API_KEY);