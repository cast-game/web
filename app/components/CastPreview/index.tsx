// "use client"
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTimeSince } from "@/lib/helpers";
import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { CastData } from "@/lib/types";

interface Props {
	castData: CastData;
	showPrice?: boolean;
}

const CastPreview = ({ castData, showPrice = true }: Props) => {
	if (!castData) return null;
	const { cast, value, price } = castData;

	const timeSince = getTimeSince(
		Math.floor(new Date(cast.timestamp).getTime()).toString()
	);

	const embeds = cast.embeds.map((embed: any) => {
		if (embed.metadata) {
			if (embed.metadata.content_type.split(";")[0] === "text/html") {
				return "frame";
			}
			return embed.metadata.content_type.split("/")[0];
		}
		return "quote";
	});

	return (
		<Link
			href={`https://warpcast.com/${cast.author.username}/${cast.hash}`}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div className="p-3 rounded hover:bg-slate-100 bg-slate-200">
				<div className="flex" key={cast.hash}>
					<Avatar className="mr-3 shrink-0 sm:h-11 sm:w-11 h-10 w-10">
						<AvatarImage src={cast.author.pfp_url} />
						<AvatarFallback>@{cast.author.username}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col text-black w-full text-sm sm:text-base ">
						<div className="flex items-start justify-between mb-1">
							<div className="flex flex-wrap items-center">
								<p className="font-semibold mr-1">{cast.author.display_name}</p>
								<p className="font-medium text-gray-600">
									@{cast.author.username} · {timeSince}
								</p>
							</div>
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="text-xs flex items-center justify-center px-2 py-1 bg-gradient-to-r from-[#45A3B8] to-[#23B68A] text-white font-semibold rounded">
											{value}
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											This score represents the popularity of the cast.{" "}
											<a
												href="https://docs.airstack.xyz/airstack-docs-and-faqs/abstractions/social-capital-value-and-social-capital-scores"
												target="_blank"
												className="text-blue-400 hover:text-blue-300"
											>
												Read more here
											</a>
											.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<p className="font-medium pr-12 line-clamp-3 mb-2 text-sm">
							{cast.text.replace(/https?:\/\/\S+/i, "")}
						</p>
						<div className="flex justify-between items-center">
							<div className="flex flex-wrap gap-2">
								{embeds.map((embed: string) => (
									<div
										key={embed}
										className="flex items-center font-medium rounded-full px-2 py-1 text-xs bg-black/20"
									>
										+ {embed}
									</div>
								))}
							</div>
							{showPrice && (
								<div className="flex items-center gap-1 text-black font-bold py-1 px-2 bg-slate-400 rounded justify-center">
									<Image
										src="/eth-logo.png"
										width={17}
										height={17}
										alt="Ethereum logo"
									/>
									<span className="text-clip">
										{Number(price?.toFixed(5)).toString()}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default CastPreview;
