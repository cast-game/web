"use client";
import Image from "next/image";
import CastPreview from "./components/CastPreview";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	getActiveTickets,
	getCastData,
	getCasts,
	getChannel,
	getDetails,
} from "@/lib/api";
import { useContext } from "react";
import { RoundContext } from "./context/provider";
import { CastData, TicketData } from "@/lib/types";
import { Channel } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Spinner } from "@radix-ui/themes";
import { useInView } from "react-intersection-observer";
import { formatEther } from "viem";
import CountdownTimer from "./components/CountdownTimer";
const PAGE_SIZE = 10;

const Home = () => {
	const round = useContext(RoundContext);

	const [details, setDetails] = useState<any>(null);
	const [channel, setChannel] = useState<Channel | null>(null);

	const [castsData, setCastsData] = useState<CastData[] | null>(null);
	const [ticketsData, setTicketsData] = useState<TicketData[] | null>(null);

	const [hasMore, setHasMore] = useState(true);
	const [sortBy, setSortBy] = useState<"score" | "price" | "latest">("latest");
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);

	const { ref, inView } = useInView();
	const isFetchingRef = useRef(false);

	const getSortedTickets = useCallback(
		(tickets: TicketData[], sort: string) => {
			switch (sort) {
				case "latest":
					return [...tickets].sort((a, b) => b.createdTime - a.createdTime);
				case "score":
					return [...tickets].sort((a, b) => b.value - a.value);
				case "price":
					return [...tickets].sort((a, b) => b.price - a.price);
				default:
					return tickets;
			}
		},
		[]
	);

	const fetchCasts = useCallback(
		async (tickets: TicketData[], sort: string, currentPage: number) => {
			if (isFetchingRef.current) return;
			isFetchingRef.current = true;

			try {
				const sortedTickets = getSortedTickets(tickets, sort);
				const startIndex = (currentPage - 1) * PAGE_SIZE;
				const endIndex = startIndex + PAGE_SIZE;
				const paginatedTickets = sortedTickets.slice(startIndex, endIndex);

				const castsHashes = paginatedTickets.map((ticket) => ticket.castHash);
				const casts = await getCasts(castsHashes);

				const newCastsData = paginatedTickets.map((ticket: TicketData) => {
					const castDetails = casts.find(
						(cast: any) => cast.hash === ticket.castHash
					);
					return {
						value: ticket.value,
						price: parseFloat(formatEther(BigInt(ticket.price))),
						cast: castDetails,
					};
				});

				setCastsData((prevCasts: any) =>
					currentPage === 1 ? newCastsData : [...prevCasts, ...newCastsData]
				);
				setHasMore(endIndex < sortedTickets.length);
				setPage(currentPage + 1);
			} catch (error) {
				console.error("Error fetching casts:", error);
			} finally {
				isFetchingRef.current = false;
			}
		},
		[getSortedTickets]
	);

	const fetchInitialData = useCallback(async () => {
		try {
			setIsLoading(true);
			const [details, channel, tickets] = await Promise.all([
				getDetails(round?.contractAddress as `0x${string}`),
				getChannel(round?.channelId!),
				getActiveTickets(),
			]);

			setDetails(details);
			setChannel(channel);

			if (tickets.length === 0) {
				setIsLoading(false);
				setHasMore(false);
				setCastsData([]);
				return;
			}

			const castsHashes = tickets.map((ticket: any) => ticket.castHash);
			const scoresData = await getCastData(castsHashes);

			const ticketsData: TicketData[] = tickets.map(
				({ castHash, price, createdTime }: any) => {
					const data = scoresData.find((data: any) => data.hash === castHash);
					return {
						castHash,
						price,
						value: Number(data.score),
						createdTime: Math.floor(new Date(createdTime).getTime() / 1000),
					};
				}
			);

			setTicketsData(ticketsData);
			await fetchCasts(ticketsData, sortBy, 1);
		} catch (error) {
			console.error("Error fetching initial data:", error);
		} finally {
			setIsLoading(false);
		}
	}, [round?.channelId, fetchCasts, round?.contractAddress, sortBy]);

	useEffect(() => {
		fetchInitialData();
	}, [fetchInitialData]);

	useEffect(() => {
		if (inView && !isLoading && hasMore && ticketsData) {
			fetchCasts(ticketsData, sortBy, page);
		}
	}, [inView, isLoading, hasMore, ticketsData, page, fetchCasts, sortBy]);

	const handleSortChange = useCallback(
		(newSortBy: "score" | "price" | "latest") => {
			if (ticketsData && sortBy !== newSortBy) {
				setSortBy(newSortBy);
				setCastsData(null);
				setPage(1);
				setHasMore(true);
				fetchCasts(ticketsData, newSortBy, 1);
			}
		},
		[sortBy, ticketsData, fetchCasts]
	);

	const getEndTimeAndLabel = useCallback(() => {
		if (!round) return { endTime: null, label: "-" };

		const now = new Date();
		const tradingEnd = new Date(round.tradingEnd);
		const gameEnd = new Date(round.gameEnd);

		if (now < tradingEnd) {
			return {
				endTime: tradingEnd,
				label: "trading ends",
				indicatorColor: "bg-green-500",
			};
		} else if (now < gameEnd) {
			return {
				endTime: gameEnd,
				label: "game ends",
				indicatorColor: "bg-emerald-500",
			};
		} else {
			return {
				endTime: null,
				label: "game ended",
				indicatorColor: "bg-zinc-500",
			};
		}
	}, [round]);

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

	const { endTime, label, indicatorColor } = getEndTimeAndLabel();

	return (
		<div className="flex flex-col w-full">
			<div className="sm:flex sm:flex-row flex-col justify-between items-center mb-6">
				<div className="flex items-center gap-3 sm:mb-0 mb-2">
					<div className="relative">
						{label === "trading ends" && (
							<div className="absolute -inset-0.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
						)}
						<div
							className={`relative rounded-full h-2 w-2 ${indicatorColor}`}
						></div>
					</div>
					<span className="sm:text-2xl text-xl font-medium text-slate-300">
						{round?.title}
					</span>
				</div>
				<a
					href={`https://warpcast.com/~/channel/${channel?.id}`}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center sm:ml-4 gap-2"
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
					<span className="sm:text-lg text-md font-bold">/{round?.channelId}</span>
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
				<StatBox
					label={label}
					value={endTime ? <CountdownTimer endTime={endTime} /> : "-"}
				/>
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
				{castsData ? (
					<>
						{castsData.length > 0 ? (
							<div className="flex flex-col py-6 space-y-4">
								{castsData.map((castData: CastData) => (
									<CastPreview castData={castData} key={castData.cast.hash} />
								))}
								{hasMore && (
									<div
										ref={ref}
										className="flex justify-center items-center p-4"
									>
										<Spinner size="3" />
									</div>
								)}
							</div>
						) : (
							<div className="w-full flex justify-center items-center pt-6 text-slate-400">
								<span>There are no casts to display here yet.</span>
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

export default Home;
