import { config } from "dotenv";
config();

export const getCasts = async (castsHashes: string[]) => {
  const endpoint = `https://api.neynar.com/v2/farcaster/casts?casts=${castsHashes.join(
    "%2C"
  )}&sort_type=likes`;

  const res = await fetch(endpoint, {
    headers: {
      accept: "application/json",
      api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY!,
    },
  });

  const response = await res.json();
  return response.result.casts;
};
