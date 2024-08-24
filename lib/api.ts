import { client } from "./viem";
import { formatEther } from "viem";

const apiEndpoint = "https://api-production-c6c20.up.railway.app/";

export const getCasts = async (castsHashes: string[]) => {
	const res = await fetch("/api/getCasts", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ castsHashes }),
	});
	if (!res.ok) throw new Error("Failed to fetch casts");
	return await res.json();
};

export const getUsers = async (fids: number[]) => {
	const res = await fetch("/api/getUsers", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ fids }),
	});
	if (!res.ok) throw new Error("Failed to fetch users");
	return await res.json();
};

export const getChannel = async (channelId: string) => {
	const res = await fetch("/api/getChannel", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ channelId }),
	});
	if (!res.ok) throw new Error("Failed to fetch channel");
	return await res.json();
};

export const getCastData = async (castsHashes: string[]) => {
	const res = await fetch("/api/getCastData", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ castsHashes }),
	});
	return await res.json();
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
