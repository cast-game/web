import { NeynarV2APIClient } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { config } from "dotenv";
import { apiEndpoint, gameAddress, priceTiers } from "./constants";
import { client } from "./viem";
import { formatEther } from "viem";
import { CastData } from "./types";
import { fetchQuery } from "@airstack/airstack-react";
config();

const neynar = new NeynarV2APIClient(process.env.NEXT_PUBLIC_NEYNAR_API_KEY!);

export const getCasts = async (castsHashes: string[]) => {
	const res = await neynar.fetchBulkCasts(castsHashes);
	return res.result.casts;
};

// export const getActiveCasts = async () => {
// 	const ticketsRes = await queryData(`{
//     tickets {
//       items {
//         id
//         buyPrice
//       }
//     }
//   }`);

// 	return ticketsRes.tickets.items.map((ticket: any) => ({
// 		castHash: ticket.id,
// 		price: formatEther(ticket.buyPrice),
// 	}));
// };

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

export async function getPaginatedCasts(
	sortBy: "score" | "price" | "latest",
	page: number,
	itemsPerPage: number
): Promise<{ casts: CastData[]; hasMore: boolean }> {
	const offset = (page - 1) * itemsPerPage;

	console.log(sortBy);
	switch (sortBy) {
		case "latest":
			return await getLatestCasts(offset, itemsPerPage);
		case "score":
			return await getHighestScoredCasts(offset, itemsPerPage);
		case "price":
			return await getHighestPricedCasts(offset, itemsPerPage);
		default:
			throw new Error("Invalid sort option");
	}
}

async function getLatestCasts(offset: number, limit: number) {
	const activeCasts = await getActiveCasts("createdTime");
	console.log(activeCasts)

	// Paginate the sorted casts
	const paginatedCastsHashes = activeCasts
		.slice(offset, offset + limit)
		.map((cast: any) => cast.castHash);

	// Fetch casts details
	const castsDetails = await neynar.fetchBulkCasts(paginatedCastsHashes);

	// Fetch SCV data for these casts
	const scvQueryRes = await fetchQuery(getSCVQuery(paginatedCastsHashes));
	const castScores = handleSCVData(scvQueryRes.data.FarcasterCasts.Cast);

	// Combine all data
	const enrichedCasts = paginatedCastsHashes.map((hash: any) => {
		const castDetail = castsDetails.result.casts.find(
			(cast) => cast.hash === hash
		);
		const priceData = activeCasts.find((cast: any) => cast.castHash === hash);
		const scoreData = castScores.find((score: any) => score.hash === hash);
		return {
			socialCapitalValue: scoreData ? scoreData.score : 0,
			price: priceData ? parseFloat(priceData.price) : 0,
			cast: castDetail,
		};
	});

	return {
		casts: enrichedCasts,
		hasMore: offset + limit < activeCasts.length,
	};
}

async function getHighestScoredCasts(offset: number, limit: number) {
	// Get all active casts
	const activeCasts = await getActiveCasts();
	const castsHashes = activeCasts.map((cast: any) => cast.castHash);

	// Fetch SCV data for all casts
	const scvQueryRes = await fetchQuery(getSCVQuery(castsHashes));
	const castScores = handleSCVData(scvQueryRes.data.FarcasterCasts.Cast)
		.sort((a: any, b: any) => b.score - a.score)
		.slice(offset, offset + limit);

	// Paginate the sorted casts
	const paginatedCastsHashes = castScores
		.slice(offset, offset + limit)
		.map((cast: any) => cast.hash);

	const castsDetails = await neynar.fetchBulkCasts(paginatedCastsHashes);

	// Combine all data
	const enrichedCasts = castScores.map((scoreData: any) => {
		const castDetail = castsDetails.result.casts.find(
			(cast) => cast.hash === scoreData.hash
		);
		const priceData = activeCasts.find(
			(cast: any) => cast.castHash === scoreData.hash
		);
		return {
			socialCapitalValue: scoreData.score,
			price: priceData ? parseFloat(priceData.price) : 0,
			cast: castDetail,
		};
	});

	return {
		casts: enrichedCasts,
		hasMore: castScores.length === limit,
	};
}

async function getHighestPricedCasts(offset: number, limit: number) {
	// Get active casts sorted by price
	const activeCasts = await getActiveCasts();

	// Fetch cast details for the paginated set
	const paginatedCastsHashes = activeCasts.map((cast: any) => cast.castHash);
	const castsDetails = await neynar.fetchBulkCasts(paginatedCastsHashes);

	// Fetch SCV data for these casts
	const scvQueryRes = await fetchQuery(getSCVQuery(paginatedCastsHashes));
	const castScores = handleSCVData(scvQueryRes.data.FarcasterCasts.Cast);

	// Combine all data
	const enrichedCasts = activeCasts.map((priceData: any) => {
		const castDetail = castsDetails.result.casts.find(
			(cast) => cast.hash === priceData.castHash
		);
		const scoreData = castScores.find(
			(score: any) => score.hash === priceData.castHash
		);
		return {
			socialCapitalValue: scoreData ? scoreData.score : 0,
			price: parseFloat(priceData.price),
			cast: castDetail,
		};
	});

	return {
		casts: enrichedCasts,
		hasMore: activeCasts.length === limit,
	};
}

async function getActiveCasts(orderBy?: string) {
	const ticketsRes = await queryData(`{
    tickets(${orderBy && `orderBy: "${orderBy}", orderDirection: "desc"`}) {
      items {
        id
        buyPrice
				createdTime
      }
    }
  }`);

	return ticketsRes.tickets.items.map((ticket: any) => ({
		castHash: ticket.id,
		price: formatEther(ticket.buyPrice),
	}));
}

async function enrichCastsData(casts: any[], activeCasts: any[]) {
	const castsHashes = casts.map((cast) => cast.hash);
	const scvQueryRes = await fetchQuery(getSCVQuery(castsHashes));
	const castScores = handleSCVData(scvQueryRes.data.FarcasterCasts.Cast);

	return casts.map((cast) => {
		const priceData = activeCasts.find((ac) => ac.castHash === cast.hash);
		const scoreData = castScores.find((sc: any) => sc.hash === cast.hash);
		return {
			socialCapitalValue: scoreData ? scoreData.score : 0,
			price: priceData ? parseFloat(priceData.price) : 0,
			cast,
		};
	});
}

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
