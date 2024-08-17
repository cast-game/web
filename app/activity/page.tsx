"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
	getCasts,
	getSCVQuery,
	getUsers,
	handleSCVData,
	queryData,
} from "@/lib/api";
import CastPreview from "../components/CastPreview";
import { formatEther } from "viem";
import { getTimeSince } from "@/lib/helpers";
import { CastData } from "@/lib/types";
import { fetchQuery, init } from "@airstack/airstack-react";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Spinner } from "@radix-ui/themes";
init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);

const Activity = () => {
	const [casts, setCasts] = useState<CastData[] | null>(null);
	const [transactions, setTransactions] = useState<any[] | null>(null);
	const [users, setUsers] = useState<User[] | null>(null);
	const [endCursor, setEndCursor] = useState<string | null>(null);
	const [hasNextPage, setHasNextPage] = useState(true);
	const { ref, inView } = useInView();

	const fetchData = async (cursor: string | null) => {
		const response = await queryData(`{
      transactions(
        limit: 10,
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
		setEndCursor(response.transactions.pageInfo.endCursor);
		setHasNextPage(response.transactions.pageInfo.hasNextPage);

		setTransactions((prevTransactions) =>
			prevTransactions
				? [...prevTransactions, ...newTransactions]
				: newTransactions
		);

		const castsHashes = newTransactions.map((tx: any) => tx.castHash);

		const fids = Array.from(
			new Set(newTransactions.map((tx: any) => tx.senderFid))
		) as number[];

		const [usersRes, castsRes, scvQueryData] = await Promise.all([
			getUsers(fids),
			getCasts(castsHashes),
			fetchQuery(getSCVQuery(castsHashes)),
		]);

		const castScores = handleSCVData(scvQueryData.data.FarcasterCasts.Cast);

		setUsers((prevUsers) =>
			prevUsers ? [...prevUsers, ...usersRes.users] : usersRes.users
		);
		setCasts((prevCasts) => {
			const newCasts = castsRes.map((cast: any, i: number) => ({
				cast,
				price: 0,
				socialCapitalValue: castScores.find((c: any) => c.hash === cast.hash)
					.score,
			}));
			return prevCasts ? [...prevCasts, ...newCasts] : newCasts;
		});
	};

	useEffect(() => {
		fetchData(null);
	}, []);

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchData(endCursor);
		}
	}, [inView, hasNextPage, endCursor]);

	return (
		<div className="flex justify-center">
			<div className="flex flex-col gap-4 w-full">
				{transactions && casts && users ? (
					<>
						{transactions.map((tx: any, i: number) => {
							const castData = casts
								.find((c: any) => c.cast.hash === tx.castHash);
							const sender = users.find(
								(user: any) => user.fid === Number(tx.senderFid)
							);
							const timeSince = getTimeSince(tx.timestamp);

							return (
								<div className="p-3 bg-zinc-300 rounded" key={i}>
									<div className="flex items-center font-medium text-black justify-between">
										<div className="flex items-center">
											<a
												href={`https://warpcast.com/${sender?.username}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<div className="flex items-center cursor-pointer">
													<Image
														src={sender?.pfp_url!}
														width={30}
														height={30}
														alt={sender?.username!}
														className="rounded-full"
													/>
													<span className="font-bold mr-1 ml-2">
														@{sender?.username}
													</span>
												</div>
											</a>
											<span>
												{tx.type === "buy" ? "purchased" : "sold"} for{" "}
												<b>{formatEther(BigInt(tx.price))} ETH</b>
											</span>
										</div>
										<span className="text-sm">{`${timeSince} ${
											timeSince === "just now" ? "" : "ago"
										}`}</span>
									</div>
									<div
										className={`p-3 rounded bg-slate-200 w-full mt-3`}
										key={i}
									>
										<CastPreview castData={castData!} showPrice={false} />
									</div>
								</div>
							);
						})}
						{hasNextPage && (
							<div ref={ref} className="flex justify-center items-center p-4">
								<Spinner size="3" />
							</div>
						)}
					</>
				) : (
					<div className="flex justify-center items-center pt-16">
						<Spinner size="3" />
					</div>
				)}
			</div>
		</div>
	);
};

export default Activity;
