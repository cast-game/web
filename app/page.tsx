"use client";
import Image from "next/image";
import CastPreview from "./components/CastPreview";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	getCasts,
	getChannel,
	getDetails,
	getPaginatedCasts,
	handleSCVData,
} from "@/lib/api";
import { useContext } from "react";
import { RoundContext } from "./context/provider";
import { CastData } from "@/lib/types";
import { fetchQuery, init } from "@airstack/airstack-react";
import { Channel } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Spinner } from "@radix-ui/themes";
import { useInView } from "react-intersection-observer";
init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);

const Home = () => {
	const round = useContext(RoundContext);

	const [sortBy, setSortBy] = useState<"score" | "price" | "latest">("latest");
	const [details, setDetails] = useState<any>(null);
	const [channel, setChannel] = useState<Channel | null>(null);
	const [casts, setCasts] = useState<CastData[] | null>(null);

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const { ref, inView } = useInView();
	const initialFetchCompletedRef = useRef(false);
	const isFetchingRef = useRef(false);

	const fetchInitialData = useCallback(async () => {
		if (initialFetchCompletedRef.current) return;

		const [details, channel] = await Promise.all([
			getDetails(),
			getChannel(round?.channelId!),
		]);

		setDetails(details);
		setChannel(channel);
	}, [round?.channelId]);

	const fetchCasts = useCallback(async () => {
		if (!hasMore || isFetchingRef.current) return;
		isFetchingRef.current = true;

		try {
			const { casts: newCasts, hasMore: moreAvailable } =
				await getPaginatedCasts(sortBy, page, 10);
			setCasts((prevCasts) =>
				prevCasts ? [...prevCasts, ...newCasts] : newCasts
			);
			setHasMore(moreAvailable);
			setPage((prevPage) => prevPage + 1);
			console.log("fetched more data");
		} catch (error) {
			console.error("Error fetching casts:", error);
		}
		isFetchingRef.current = false;
	}, [sortBy, page]);

	useEffect(() => {
		const loadInitialData = async () => {
			await fetchInitialData();
			if (!casts?.length) {
				await fetchCasts();
			}
		};
		loadInitialData();
	}, [fetchInitialData, fetchCasts]);

	useEffect(() => {
		if (inView && hasMore && !isFetchingRef.current) {
			fetchCasts();
		}
	}, [inView, hasMore, fetchCasts]);

	const handleSortChange = useCallback(
		(newSortBy: "score" | "price" | "latest") => {
			if (sortBy !== newSortBy) {
				setSortBy(newSortBy);
				setCasts([]);
				setPage(1);
				setHasMore(true);
				fetchCasts();
			}
		},
		[sortBy, fetchCasts]
	);

	interface StatBoxProps {
		label: string;
		value: any;
	}

	const StatBox = ({ label, value }: StatBoxProps) => {
		if (!details) {
			return (
				<div className="flex h-20 bg-slate-500/50 rounded flex-1 min-w-[150px] animate-pulse"></div>
			);
		}

		return (
			<div className="flex flex-col items-center justify-center px-6 py-4 bg-slate-200 rounded flex-1 min-w-[150px]">
				<span className="text-2xl font-bold">{value}</span>
				<span className="text-md">{label}</span>
			</div>
		);
	};

	return (
		<div className="flex flex-col w-full">
			<div className="flex justify-between items-center mb-6 ">
				<div className="flex items-center gap-3">
					<div className="relative">
						<div className="absolute -inset-0.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
						<div className="relative rounded-full h-2 w-2 bg-green-500"></div>
					</div>
					<span className="text-2xl font-medium text-slate-300">
						{round?.title}
					</span>
				</div>
				<a
					href={`https://warpcast.com/~/channel/${channel?.id}`}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center ml-4 gap-2"
				>
					{channel ? (
						<Image
							src={channel?.image_url!}
							alt={"/" + round?.channelId}
							width={28}
							height={28}
							className="rounded-full"
						/>
					) : (
						<div className="h-7 w-7 rounded-full bg-slate-500/50 animate-pulse"></div>
					)}
					<span className="text-lg font-bold">/{round?.channelId}</span>
				</a>
			</div>

			<div className="flex flex-wrap items-stretch gap-3 text-black">
				<StatBox
					label="reward pool"
					value={
						<div className="flex items-center gap-2">
							<Image
								src="/eth-logo.png"
								width={25}
								height={25}
								alt="Ethereum logo"
							/>
							<span className="text-2xl font-bold">{details?.rewardPool}</span>
						</div>
					}
				/>
				<StatBox label="transactions" value={details?.transactionCount} />
				<StatBox label="participants" value={details?.userCount} />
				<StatBox label="game ends" value="23:59:59" />
			</div>

			<div className="mt-6 sm:mt-10 gap-4">
				<div className="flex flex-row items-center justify-between text-slate-300">
					<span className="text-xl font-medium">Top Casts</span>
					<div className="flex cursor-pointer gap-3">
						<span
							onClick={() => handleSortChange("latest")}
							className={`${
								sortBy !== "latest" ? "opacity-65" : ""
							} hover:text-white`}
						>
							latest
						</span>
						<span
							onClick={() => handleSortChange("score")}
							className={`${
								sortBy !== "score" ? "opacity-65" : ""
							} hover:text-white`}
						>
							by score
						</span>
						<span
							onClick={() => handleSortChange("price")}
							className={`${
								sortBy !== "price" ? "opacity-65" : ""
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
								className="p-3 rounded hover:bg-slate-100 bg-slate-200 hover:outline outline-4 outline-purple-700"
							>
								<CastPreview castData={castData} />
							</div>
						))}
						{hasMore && (
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
		</div>
	);
};

export default Home;
