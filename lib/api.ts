import { NeynarV2APIClient } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { config } from "dotenv";
config();

const neynar = new NeynarV2APIClient(process.env.NEXT_PUBLIC_NEYNAR_API_KEY!)
const baseUrl = "https://api.neynar.com/v2/farcaster";

export const getCasts = async (castsHashes: string[]) => {
  console.log(castsHashes);
  const endpoint = `${baseUrl}/casts?casts=${castsHashes.join(
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

export const getChannel = async (channelId: string) => {
  const res = await neynar.fetchBulkChannels([channelId]);
  return res.channels[0]
}

// export const getTicketInfo = async (cast: Cast) => {
//   // TODO: Change later
//   const holderFids = cast.reactions.likes.map((user: any) => user.fid);
//   const endpoint = `${baseUrl}/user/bulk?fids=${holderFids.join("%2C")}`;
//   const res = await fetch(endpoint, {
//     headers: {
//       accept: "application/json",
//       api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY!,
//     },
//   });

//   const response = await res.json();

//   return {
//     topHolders: response.users,
//     price: 999,
//   };
// };
