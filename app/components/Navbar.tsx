"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { usePathname } from "next/navigation";
import { getChannel } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Channel } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { RoundContext } from "../context/round";
import { usePrivy } from "@privy-io/react-auth";

const links = [
	{ href: "/", label: "Overview" },
	{ href: "/activity", label: "Activity" },
	{ href: "/tickets", label: "My Tickets" },
];

const Navbar = () => {
	const round = useContext(RoundContext);
	const { login, logout, user } = usePrivy();

	const pathname = usePathname();
	const [channel, setChannel] = useState<Channel | null>(null);

	const fetchChannel = async () => {
		const response = await getChannel(round!.channelId);
		setChannel(response);
	};

	useEffect(() => {
		fetchChannel();
	}, [round]);

	return (
		<nav className="p-3 flex justify-between items-center absolute top-0 w-full">
			<a href={`https://warpcast.com/~/channel/${channel?.id}`} target="_black">
				<div className="flex items-center ml-4 gap-2">
					<div className="rounded-full h-2 w-2 bg-green-500" />
					<Image
						src={channel?.image_url!}
						alt={"/" + channel?.id}
						width={30}
						height={30}
						className="rounded-full"
					/>
					<span className="text-lg font-bold">/{channel?.id}</span>
				</div>
			</a>
			<div className="flex gap-5 items-center">
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
				{user ? (
					<div className="flex gap-2 items-center">
						<a
							href={`https://warpcast.com/${user.farcaster?.username}`}
							target="_blank"
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
						className="flex bg-indigo-600 rounded px-5 py-2 cursor-pointer font-medium hover:bg-indigo-600/90"
					>
						Sign In With Warpcast
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
