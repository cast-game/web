"use client";
import Image from "next/image";
import CastPreview from "../components/CastPreview";
import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getCastData, getCasts, getUsers, queryData } from "@/lib/api";
import { CastData } from "@/lib/types";
import { formatEther } from "viem";
import { Spinner } from "@radix-ui/themes";

const ITEMS_PER_PAGE = 10;

const Tickets = () => {
	const { user } = usePrivy();
	const [data, setData] = useState<CastData[]>([]);
	const [endCursor, setEndCursor] = useState<string | null>(null);
	const [hasNextPage, setHasNextPage] = useState(true);
	const { ref, inView } = useInView();
	const [addresses, setAddresses] = useState<string[]>([]);

	const fetchUserAddresses = useCallback(async () => {
		const res = await getUsers([user?.farcaster?.fid!]);
		const userData = res.users[0];
		const userAddresses = [
			userData.custody_address,
			...userData.verified_addresses.eth_addresses,
		];
		setAddresses(userAddresses);
		return userAddresses;
	}, [user]);

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
		const [castScores, castsRes, ticketsRes] = await Promise.all([
			getCastData(castsHashes),
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

		const castData: CastData[] = castScores.map((c: any, i: number) => {
			const ticket = ticketsRes.tickets.items.find((t: any) => t.id === c.hash);
			const balance = balances.find((b) => b.castHash === c.hash)?.balance;
			const cast = castsRes.find((cast: any) => cast.hash === c.hash);
			return {
				value: c.score,
				balance,
				cast,
				price: formatEther(ticket.buyPrice),
			};
		});

		return castData;
	};

	const fetchData = useCallback(
		async (cursor: string | null) => {
			if (!addresses.length) {
				const userAddresses = await fetchUserAddresses();
				const {
					balances,
					endCursor: newEndCursor,
					hasNextPage: newHasNextPage,
				} = await fetchTickets(userAddresses, cursor);
				if (balances.length === 0) {
					setData([]);
					setHasNextPage(false);
					return;
				}
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
				if (balances.length === 0) {
					setData([]);
					setHasNextPage(false);
					return;
				}
				const castData = await fetchCastData(balances);

				setData([...data, ...castData]);
				setEndCursor(newEndCursor);
				setHasNextPage(newHasNextPage);
			}
		},
		[addresses, fetchUserAddresses, data]
	);

	useEffect(() => {
		if (user?.farcaster) fetchData(null);
	}, [user, fetchData]);

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchData(endCursor);
		}
	}, [inView, hasNextPage, endCursor, fetchData]);

	return (
		<div className="flex justify-center">
			{data ? (
				<>
					{data.length > 0 ? (
						<div className="flex flex-col gap-4">
							{data.map((castData: CastData, i: number) => (
								<div className="p-3 bg-zinc-300 rounded" key={i}>
									<div className="flex items-center text-black justify-between mb-3">
										<div className="flex items-center text-lg font-bold">
											<div className="flex gap-3 items-center">
												<div className="flex text-xl items-center gap-1 text-black font-bold py-1 px-3 bg-black/20 rounded justify-center">
													<Image
														src="/eth-logo.png"
														width={20}
														height={20}
														alt="Ethereum logo"
													/>
													<span>
														{Number(
															Number(castData.price).toFixed(5)
														).toString()}
													</span>
												</div>
												{/* <span className="text-lime-600">+100%</span> */}
											</div>
										</div>
										{castData.balance! > 1 && (
											<span className="text-lg font-bold">{`${castData.balance}x`}</span>
										)}
									</div>

									<CastPreview castData={castData} showPrice={false} />
								</div>
							))}
							{hasNextPage && (
								<div ref={ref} className="flex justify-center items-center p-4">
									<Spinner size="3" />
								</div>
							)}
						</div>
					) : (
						<div className="w-full flex justify-center items-center pt-6 text-slate-400">
							<span>You do not own any tickets.</span>
						</div>
					)}
				</>
			) : (
				<div className="flex justify-center items-center pt-16">
					<Spinner size="3" />
				</div>
			)}
		</div>
	);
};

export default Tickets;
