"use client";
import Image from "next/image";
import CastPreview from "./components/CastPreview";
import { useEffect, useState } from "react";
import {
	getActiveCasts,
	getCasts,
	getDetails,
	getSCVQuery,
	handleSCVData,
} from "@/lib/api";
import { useContext } from "react";
import { RoundContext } from "./context/provider";
import { CastData } from "@/lib/types";
import { fetchQuery, init } from "@airstack/airstack-react";
init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);

const Home = () => {
	const round = useContext(RoundContext);
	const endsIn = "-";

	const [sortBy, setSortBy] = useState("score");
	const [details, setDetails] = useState<any>(null);
	const [casts, setCasts] = useState<CastData[] | null>(null);

	const fetchData = async () => {
		const response = await getDetails();
		setDetails(response);

		const activeCastDetails = await getActiveCasts();
		const activeCasts = await getCasts(
			activeCastDetails.map((c: any) => c.castHash)
		);

		const castHashes = activeCastDetails.map((c: any) => c.castHash);

		const { data, error } = await fetchQuery(getSCVQuery(castHashes));
		const castScores = handleSCVData(data.FarcasterCasts.Cast).sort(
			(a: any, b: any) => b.score - a.score
		);

		setCasts(
			castScores.map((c: any, i: number) => {
				const price = activeCastDetails.find(
					(cast: any) => cast.castHash === c.hash
				).price;
				const cast = activeCasts.find((cast: any) => cast.hash === c.hash);

				return {
					socialCapitalValue: c.score,
					price,
					cast,
				};
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="flex flex-col text-black px-4 sm:px-8 w-full">
			<div className="flex rounded items-center justify-center flex-col p-6 sm:p-8 bg-slate-200 rounded">
				{round ? (
					<h1 className="text-2xl sm:text-3xl font-bold text-center">
						{round.title}
					</h1>
				) : (
					<div className="h-9 w-full bg-grey-300 animate-pulse rounded"></div>
				)}

				<div className="flex flex-col sm:flex-row items-center gap-4 my-7">
					<div className="flex flex-col items-center rounded px-6 py-3 bg-slate-300">
						{details ? (
							<div className="flex items-center gap-2">
								<Image
									src="/eth-logo.png"
									width={27}
									height={27}
									alt="Ethereum logo"
								/>
								<span className="text-2xl sm:text-3xl font-bold">
									{details.rewardPool}
								</span>
							</div>
						) : (
							<div className="h-9 w-full bg-grey-300 animate-pulse rounded"></div>
						)}
						<span className="text-lg">reward pool</span>
					</div>

					<div className="flex flex-col items-center px-6 py-3 bg-slate-300 rounded">
						{details ? (
							<span className="text-2xl sm:text-3xl font-bold">
								{details.transactionCount}
							</span>
						) : (
							<div className="h-9 w-full bg-grey-300 animate-pulse rounded"></div>
						)}
						<span className="text-lg">transactions</span>
					</div>

					<div className="flex flex-col items-center px-6 py-3 bg-slate-300 rounded">
						{details ? (
							<span className="text-2xl sm:text-3xl font-bold">
								{details.userCount}
							</span>
						) : (
							<div className="h-9 w-full bg-grey-300 animate-pulse rounded"></div>
						)}
						<span className="text-lg">participants</span>
					</div>
				</div>

				<p className="text-lg sm:text-xl font-medium text-center">
					Ends in <span className="font-bold">{endsIn}</span>
				</p>
			</div>

			<div className="mt-8 sm:mt-12 gap-4">
				<div className="flex flex-row items-center gap-2 sm:gap-5 text-slate-300">
					<span className="text-xl sm:text-2xl font-medium">Top Casts</span>
					<div className="flex cursor-pointer gap-3">
						<span
							onClick={() => setSortBy("score")}
							className={`${
								sortBy === "price" ? "opacity-65" : ""
							} hover:text-white`}
						>
							by score
						</span>
						<span
							onClick={() => setSortBy("price")}
							className={`${
								sortBy === "score" ? "opacity-65" : ""
							} hover:text-white`}
						>
							by price
						</span>
					</div>
				</div>
				{casts ? (
					<div className="flex flex-col pt-6 space-y-4">
						{casts.map((castData: CastData, i: number) => (
							<div
								key={castData.cast.hash}
								className="p-4 rounded hover:bg-slate-200/95 bg-slate-200 hover:outline outline-4 outline-purple-700"
							>
								<CastPreview castData={castData} />
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col pt-6 space-y-4">
						<div className="h-24 bg-slate-500/50 animate-pulse rounded"></div>
						<div className="h-24 bg-slate-500/50 animate-pulse rounded"></div>
						<div className="h-24 bg-slate-500/50 animate-pulse rounded"></div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
