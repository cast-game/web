import { BulkCastsSortType } from "@neynar/nodejs-sdk/build/neynar-api/common/constants";
import { NeynarV2APIClient } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { config } from "dotenv";
config();

const neynar = new NeynarV2APIClient(process.env.NEXT_PUBLIC_NEYNAR_API_KEY!)
const baseUrl = "https://api.neynar.com/v2/farcaster";

export const getCasts = async (castsHashes: string[]) => {
  const res = await neynar.fetchBulkCasts(castsHashes, {
    sortType: BulkCastsSortType.LIKES,
  });
  return res.result.casts;
};

export const getChannel = async (channelId: string) => {
  const res = await neynar.fetchBulkChannels([channelId]);
  return res.channels[0]
}

export const getDetails = async () => {
	const [rewardPool, txsRes, statsRes] = await Promise.all([
		client.getBalance({
			address: gameAddress,
		}),
		queryData(`{
			transactions {
				items {
					id
				}
			}
		}`),
		queryData(`{
			gameStats(id: "0") {
				users
			}
		}`),
	]);

	return {
		rewardPool: Number(formatEther(rewardPool)).toFixed(3),
		transactionCount: txsRes.transactions.items.length,
		userCount: statsRes.gameStats.users.length,
	};
};