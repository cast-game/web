"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
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
init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);

const Activity = () => {
	const [casts, setCasts] = useState<CastData[]>();
	const [transactions, setTransactions] = useState([]);
	const [users, setUsers] = useState<User[]>();

	const fetchData = async () => {
		const response = await queryData(`{
      transactions {
        items {
          castHash
          price
          senderFid
          timestamp
          type
        }
      }
    }`);

		setTransactions(
			response.transactions.items.sort(
				(a: any, b: any) => b.timestamp - a.timestamp
			)
		);

		const castsRes = await getCasts(
			response.transactions.items.map((tx: any) => tx.castHash)
		);

		const { data, error } = await fetchQuery(
			getSCVQuery(castsRes.map((c: any) => c.hash))
		);
		const castScores = handleSCVData(data.FarcasterCasts.Cast);

		setCasts(
			castsRes.map((cast: any, i: number) => {
				return {
					cast,
					price: 0,
					socialCapitalValue: castScores.find((c: any) => c.hash === cast.hash)
						.score,
				};
			})
		);

		const fids = Array.from(
			new Set(response.transactions.items.map((tx: any) => tx.senderFid))
		) as number[];

		const usersRes = await getUsers(fids);
    console.log(usersRes.users);
		setUsers(usersRes.users);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="flex justify-center">
			{casts && users && (
				<div className="flex flex-col gap-4 max-w-4xl">
					{transactions.map((tx: any, i: number) => {
						const cast = casts
							.map((c: any) => c.cast)
							.find((c: any) => c.hash === tx.castHash);
						const sender = users.find((user: any) => user.fid === Number(tx.senderFid));
						const timeSince = getTimeSince(tx.timestamp);

						return (
							<div className="p-3 bg-zinc-300 rounded" key={i}>
								<div className="flex items-center font-medium text-black justify-between">
									<div className="flex items-center text-lg">
										<a
											href={`https://warpcast.com/${sender?.username}`}
											target="_black"
										>
											<div className="flex items-center cursor-pointer">
												<Image
													src={sender?.pfp_url!}
													width={35}
													height={35}
													alt={sender?.username!}
													className="rounded-full"
												/>
												<span className="font-bold mx-2">
													@{sender?.username}
												</span>
											</div>
										</a>
										<span>
											{tx.type === "buy" ? "purchased" : "sold"} for{" "}
											<b>{formatEther(BigInt(tx.price))} ETH</b>
										</span>
									</div>
									<span className="text-sm">{timeSince}</span>
								</div>
								<div
									className={`p-4 rounded bg-slate-200 w-full mt-3`}
									key={cast.hash}
								>
									<CastPreview castData={casts[i]} showPrice={false} />
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default Activity;
