import { BulkCastsSortType } from "@neynar/nodejs-sdk/build/neynar-api/common/constants";
import { NeynarV2APIClient } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { config } from "dotenv";
import { apiEndpoint, gameAddress } from "./constants";
import { client } from "./viem";
import { formatEther } from "viem";
config();

const neynar = new NeynarV2APIClient(process.env.NEXT_PUBLIC_NEYNAR_API_KEY!);

export const getCasts = async (castsHashes: string[]) => {
  const res = await neynar.fetchBulkCasts(castsHashes, {
    sortType: BulkCastsSortType.LIKES,
  });
  return res.result.casts;
};

export const getUsers = async (addresses: string[]) =>
  await neynar.fetchBulkUsersByEthereumAddress(addresses);

export const getChannel = async (channelId: string) => {
  const res = await neynar.fetchBulkChannels([channelId]);
  return res.channels[0];
};

export const queryData = async (query: string) => {
  const res = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const { data } = await res.json();

  return data;
};

interface Details {
  rewardPool: string;
  transactionCount: number;
  userCount: number;
}

export const getDetails = async (): Promise<Details> => {
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

export const getSCVQuery = (castHash: string) => `{
  FarcasterCasts(
    input: {filter: {hash: {_eq: "${castHash}"}}, blockchain: ALL}
  ) {
    Cast {
      socialCapitalValue {
        formattedValue
      }
      notaTokenEarned {
        formattedValue
      }
    }
  }
}`;
