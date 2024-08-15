"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { usePathname } from "next/navigation";
import { getChannel } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Channel } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { RoundContext } from "../context/provider";
import { usePrivy } from "@privy-io/react-auth";

const links = [
	{ href: "/", label: "Overview" },
	{ href: "/activity", label: "Activity" },
];

const Navbar = () => {
	const round = useContext(RoundContext);
	const { login, logout, user } = usePrivy();

	const pathname = usePathname();
	const [channel, setChannel] = useState<Channel | null>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const fetchChannel = async () => {
		const response = await getChannel(round!.channelId);
		setChannel(response);
	};

	useEffect(() => {
		fetchChannel();
	}, []);

	return (
		<nav className="p-3 flex justify-between items-center absolute top-0 w-full shadow-md z-10">
			<a
				href={`https://warpcast.com/~/channel/${channel?.id}`}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center ml-4 gap-2"
			>
				<div className="rounded-full h-2 w-2 bg-green-500" />
				<Image
					src={channel?.image_url!}
					alt={"/" + channel?.id}
					width={30}
					height={30}
					className="rounded-full"
				/>
				<span className="text-lg font-bold">/{channel?.id}</span>
			</a>

			<div className="flex gap-5 items-center">
				{/* Desktop Menu */}
				<div className="hidden md:flex gap-5 items-center">
					{links.map(({ href, label }) => (
						<Link
							key={href}
							href={href}
							className={
								pathname === href
									? "opacity-100"
									: "opacity-75 hover:opacity-100 focus:opacity-100"
							}
						>
							{label}
						</Link>
					))}
					{user && (
						<Link
							href="/tickets"
							className={
								pathname === "/tickets"
									? "opacity-100"
									: "opacity-75 hover:opacity-100 focus:opacity-100"
							}
						>
							My Tickets
						</Link>
					)}
				</div>

				{/* User or Sign In Button */}
				<div className="hidden md:flex gap-2 items-center">
					{user ? (
						<div className="flex gap-2 items-center">
							<a
								href={`https://warpcast.com/${user.farcaster?.username}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className="flex gap-2 items-center cursor-pointer hover:opacity-85">
									<Image
										src={user.farcaster?.pfp!}
										alt={`@${user.farcaster?.username}`}
										width={30}
										height={30}
										className="rounded-full"
									/>
									<span className="font-semibold">
										@{user.farcaster?.username}
									</span>
								</div>
							</a>
							<Button
								size="icon"
								variant="ghost"
								className="rounded"
								onClick={logout}
							>
								<LogOut className="h-4 w-4" />
							</Button>
						</div>
					) : (
						<div
							onClick={() => login({ loginMethods: ["farcaster"] })}
							className="bg-indigo-600 rounded px-5 py-2 cursor-pointer font-medium hover:bg-indigo-600/90"
						>
							Sign In
						</div>
					)}
				</div>

				{/* Hamburger Menu for Mobile */}
				<div className="md:hidden flex items-center">
					<button
						className="flex items-center p-2 rounded focus:outline-none focus:ring"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d={
									isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"
								}
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden flex flex-col gap-5 items-start bg-[#310E7B] shadow-lg p-4 absolute top-16 left-0 w-full z-10">
					{links.map(({ href, label }) => (
						<Link
							key={href}
							href={href}
							className={
								pathname === href
									? "opacity-100"
									: "opacity-75 hover:opacity-100 focus:opacity-100"
							}
						>
							{label}
						</Link>
					))}
					{user && (
						<Link
							href="/tickets"
							className={
								pathname === "/tickets"
									? "opacity-100"
									: "opacity-75 hover:opacity-100 focus:opacity-100"
							}
						>
							My Tickets
						</Link>
					)}
					{user ? (
						<div className="flex gap-2 items-center">
							<a
								href={`https://warpcast.com/${user.farcaster?.username}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className="flex gap-2 items-center cursor-pointer hover:opacity-85">
									<Image
										src={user.farcaster?.pfp!}
										alt={`@${user.farcaster?.username}`}
										width={30}
										height={30}
										className="rounded-full"
									/>
									<span className="font-semibold">
										@{user.farcaster?.username}
									</span>
								</div>
							</a>
							<Button
								size="icon"
								variant="ghost"
								className="rounded"
								onClick={logout}
							>
								<LogOut className="h-4 w-4" />
							</Button>
						</div>
					) : (
						<div
							onClick={() => login({ loginMethods: ["farcaster"] })}
							className="bg-indigo-600 rounded px-5 py-2 cursor-pointer font-medium hover:bg-indigo-600/90"
						>
							Sign In
						</div>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
