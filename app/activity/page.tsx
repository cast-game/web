"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getCastData, getCasts, getUsers, queryData } from "@/lib/api";
import CastPreview from "../components/CastPreview";
import { formatEther } from "viem";
import { getTimeSince } from "@/lib/helpers";
import { CastData } from "@/lib/types";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Spinner } from "@radix-ui/themes";

const PAGE_SIZE = 25;

const Activity = () => {
	const [casts, setCasts] = useState<CastData[] | null>(null);
	const [transactions, setTransactions] = useState<any[] | null>(null);
	const [users, setUsers] = useState<User[] | null>(null);
	const [endCursor, setEndCursor] = useState<string | null>(null);
	const [hasNextPage, setHasNextPage] = useState(true);
	const { ref, inView } = useInView();
	const initialFetchDone = useRef(false);

	const fetchData = useCallback(async (cursor: string | null) => {
		const response = await queryData(`{
					transactions(
						limit: ${PAGE_SIZE},
						${cursor ? `after: "${cursor}",` : ""}
						orderBy: "timestamp",
						orderDirection: "desc"
					) {
						items {
							castHash
							price
							senderFid
							timestamp
							type
						}
						pageInfo {
							endCursor
							hasNextPage
						}
					}
				}`);

		const newTransactions = response.transactions.items;
		if (newTransactions.length === 0) {
			setHasNextPage(false);
			setTransactions([]);
			setUsers([]);
			setCasts([]);
			return;
		}

		setEndCursor(response.transactions.pageInfo.endCursor);
		setHasNextPage(response.transactions.pageInfo.hasNextPage);

		setTransactions((prevTransactions) =>
			prevTransactions
				? [...prevTransactions, ...newTransactions]
				: newTransactions
		);

		const castsHashes = newTransactions.map((tx: any) => tx.castHash);

		const fids = Array.from(
			new Set(newTransactions.map((tx: any) => Number(tx.senderFid)))
		) as number[];

		const [usersRes, castsRes, castScores] = await Promise.all([
			getUsers(fids),
			getCasts(castsHashes),
			getCastData(castsHashes),
		]);

		setUsers((prevUsers) =>
			prevUsers ? [...prevUsers, ...usersRes.users] : usersRes.users
		);

		setCasts((prevCasts) => {
			const newCasts = castsRes.map((cast: any, i: number) => ({
				cast,
				price: 0,
				value: castScores.find((c: any) => c.hash === cast.hash).score,
			}));
			return prevCasts ? [...prevCasts, ...newCasts] : newCasts;
		});
	}, []);

	useEffect(() => {
		if (!initialFetchDone.current) {
			fetchData(null);
			initialFetchDone.current = true;
		}
	}, [fetchData]);

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchData(endCursor);
		}
	}, [inView, hasNextPage, endCursor, fetchData]);

	return (
		<div className="flex justify-center">
			{transactions && casts && users ? (
				<>
					{transactions.length > 0 ? (
						<div className="flex flex-col gap-4 w-full">
							{transactions.map((tx: any, i: number) => {
								const castData = casts.find(
									(c: any) => c.cast.hash === tx.castHash
								);
								const sender = users.find(
									(user: any) => user.fid === Number(tx.senderFid)
								);
								const timeSince = getTimeSince(tx.timestamp);

								return (
									<div className="p-3 bg-zinc-300 rounded" key={i}>
										<div className="flex items-center font-medium text-black justify-between mb-3">
											<div className="flex items-center gap-2">
												<a
													href={`https://warpcast.com/${sender?.username}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Image
														src={sender?.pfp_url!}
														width={30}
														height={30}
														alt={sender?.username!}
														className="rounded-full cursor-pointer"
													/>
												</a>
												<span className="text-sm sm:text-base text-clip">
													<b>@{sender?.username}{" "}</b>
													{tx.type === "buy" ? "purchased" : "sold"} for{" "}
													<b>
														{Number(
															Number(formatEther(BigInt(tx.price))).toFixed(5)
														).toString()}{" "}
														ETH
													</b>
												</span>
											</div>
											<span className="sm:text-sm text-xs text-right">{`${timeSince} ${
												timeSince === "just now" ? "" : "ago"
											}`}</span>
										</div>
										<CastPreview castData={castData!} showPrice={false} />
									</div>
								);
							})}
							{hasNextPage && (
								<div ref={ref} className="flex justify-center items-center p-4">
									<Spinner size="3" />
								</div>
							)}
						</div>
					) : (
						<div className="w-full flex justify-center items-center pt-6 text-slate-400">
							<span>There is nothing to show here yet.</span>
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

export default Activity;
