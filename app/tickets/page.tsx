"use client";
import Image from "next/image";
import CastPreview from "../components/CastPreview";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
	getCasts,
	getSCVQuery,
	getUsers,
	handleSCVData,
	queryData,
} from "@/lib/api";
import { fetchQuery, init } from "@airstack/airstack-react";
import { CastData } from "@/lib/types";
import { formatEther } from "viem";
import { Spinner } from "@radix-ui/themes";
init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);

const ITEMS_PER_PAGE = 10;

const Tickets = () => {
	const { user } = usePrivy();
	const [data, setData] = useState<CastData[] | null>(null);
	const [endCursor, setEndCursor] = useState<string | null>(null);
	const [hasNextPage, setHasNextPage] = useState(true);
	const { ref, inView } = useInView();
	const [addresses, setAddresses] = useState<string[]>([]);

	const fetchUserData = async () => {
		const res = await getUsers([user!.farcaster?.fid!]);
		const userData = res.users[0];
		const userAddresses = [
			userData.custody_address,
			...userData.verified_addresses.eth_addresses,
		];
		setAddresses(userAddresses);
		return userAddresses;
	};

	const fetchTickets = async (
		userAddresses: string[],
		cursor: string | null
	) => {
		const queryPromises = userAddresses.map(async (address: string) => {
			const output = await queryData(`{
        users(
          limit: ${ITEMS_PER_PAGE},
          ${cursor ? `after: "${cursor}",` : ""}
          where: {
            id_starts_with: "${address}"
            ticketBalance_gt: "0"
          }
        ) {
          items {
            ticketBalance
            id
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }`);
			return output.users;
		});

		const results = await Promise.all(queryPromises);

		let newBalances: any[] = [];
		let newEndCursor: string | null = null;
		let newHasNextPage = false;

		results.forEach((result) => {
			result.items.forEach((item: any) => {
				const castHash = item.id.split(":")[1];
				const existingEntry = newBalances.find(
					(entry) => entry.castHash === castHash
				);
				if (existingEntry) {
					existingEntry.balance += Number(item.ticketBalance);
				} else {
					newBalances.push({ castHash, balance: Number(item.ticketBalance) });
				}
			});

			if (result.pageInfo.hasNextPage) {
				newHasNextPage = true;
				newEndCursor = result.pageInfo.endCursor;
			}
		});

		return {
			balances: newBalances,
			endCursor: newEndCursor,
			hasNextPage: newHasNextPage,
		};
	};

	const fetchCastData = async (balances: any[]) => {
		const castsHashes = balances.map((b) => b.castHash);
		const [scvRes, castsRes, ticketsRes] = await Promise.all([
			fetchQuery(getSCVQuery(castsHashes)),
			getCasts(castsHashes),
			queryData(`{
        tickets(where: { id_in: ${JSON.stringify(castsHashes)} }) {
          items {
            buyPrice
            id
          }
        }
      }`),
		]);

		const castScores = handleSCVData(scvRes.data.FarcasterCasts.Cast);

		const castData: CastData[] = castScores.map((c: any, i: number) => {
			const ticket = ticketsRes.tickets.items.find((t: any) => t.id === c.hash);
			const balance = balances.find((b) => b.castHash === c.hash)?.balance;
			const cast = castsRes.find((cast) => cast.hash === c.hash);
			return {
				socialCapitalValue: c.score,
				balance,
				cast,
				price: formatEther(ticket.buyPrice),
			};
		});

		return castData;
	};

	const fetchData = async (cursor: string | null) => {
		if (!addresses.length) {
			const userAddresses = await fetchUserData();
			const {
				balances,
				endCursor: newEndCursor,
				hasNextPage: newHasNextPage,
			} = await fetchTickets(userAddresses, cursor);
			const castData = await fetchCastData(balances);

			setData(castData);
			setEndCursor(newEndCursor);
			setHasNextPage(newHasNextPage);
		} else {
			const {
				balances,
				endCursor: newEndCursor,
				hasNextPage: newHasNextPage,
			} = await fetchTickets(addresses, cursor);
			const castData = await fetchCastData(balances);

			setData((prevData) => (prevData ? [...prevData, ...castData] : castData));
			setEndCursor(newEndCursor);
			setHasNextPage(newHasNextPage);
		}
	};

	useEffect(() => {
		if (user) fetchData(null);
	}, [user]);

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchData(endCursor);
		}
	}, [inView, hasNextPage]);

	return (
		<div className="flex justify-center">
			{data ? (
				<div className="flex flex-col gap-4">
					{data.map((castData: CastData, i: number) => (
						<div className="p-3 bg-zinc-300 rounded" key={i}>
							<div className="flex items-center text-black justify-between">
								<div className="flex items-center text-lg font-bold">
									<div className="flex gap-3 items-center">
										<div className="flex text-xl items-center gap-1 text-black font-bold py-1 px-3 bg-black/20 rounded justify-center">
											<Image
												src="/eth-logo.png"
												width={20}
												height={20}
												alt="Ethereum logo"
											/>
											<span>{castData.price}</span>
										</div>
										{/* <span className="text-lime-600">+100%</span> */}
									</div>
								</div>
								{castData.balance! > 1 && (
									<span className="text-lg font-bold">{`${castData.balance}x`}</span>
								)}
							</div>
							<div
								className={`p-4 rounded bg-slate-200 w-full mt-3`}
								key={castData.cast.hash}
							>
								<CastPreview castData={castData} showPrice={false} />
							</div>
						</div>
					))}
					{hasNextPage && (
						<div ref={ref} className="flex justify-center items-center p-4">
							<Spinner size="3" />
						</div>
					)}
				</div>
			) : (
				<div className="flex justify-center items-center pt-16">
					<Spinner size="3" />
				</div>
			)}
		</div>
	);
};

export default Tickets;
