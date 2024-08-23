import { NeynarV2APIClient } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { config } from "dotenv";
import { apiEndpoint } from "./constants";
import { client } from "./viem";
import { formatEther } from "viem";
config();

const neynar = new NeynarV2APIClient(process.env.NEXT_PUBLIC_NEYNAR_API_KEY!);

export const getCasts = async (castsHashes: string[]) => {
	const res = await neynar.fetchBulkCasts(castsHashes);
	return res.result.casts;
};

export const getUsers = async (fids: number[]) =>
	await neynar.fetchBulkUsers(fids);

export const getChannel = async (channelId: string) => {
	const res = await neynar.fetchBulkChannels([channelId]);
	return res.channels[0];
};

export const handleSCVData = (data: any) =>
	data.map((cast: any) => {
		const score =
			cast.castValue.formattedValue > 10
				? Math.ceil(cast.castValue.formattedValue)
				: cast.castValue.formattedValue.toFixed(2);

		return {
			hash: cast.hash,
			score,
		};
	});

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

export const getDetails = async (address: `0x${string}`): Promise<Details> => {
	const [rewardPool, txsRes, statsRes] = await Promise.all([
		client.getBalance({
			address,
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
		rewardPool: Number(Number(formatEther(rewardPool)).toFixed(3)).toString(),
		transactionCount: txsRes.transactions.items.length,
		userCount: statsRes.gameStats.users.length,
	};
};

export function getSCVQuery(castsHashes: string[]) {
	return `{
    FarcasterCasts(
      input: {filter: {hash: {_in: ${JSON.stringify(
				castsHashes
			)}}}, blockchain: ALL}
    ) {
      Cast {
        hash
        castValue {
          formattedValue
        }
      }
    }
  }`;
}

export const getActiveTickets = async () => {
	const res = await queryData(`{
    tickets {
      items {
        id
        buyPrice
				castCreated
      }
    }
  }`);

	return res.tickets.items.map((ticket: any) => ({
		castHash: ticket.id,
		price: ticket.buyPrice,
		createdTime: ticket.castCreated,
	}));
};
