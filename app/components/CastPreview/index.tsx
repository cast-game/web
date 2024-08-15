// "use client"
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Cast, User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { getTimeSince } from "@/lib/helpers";
// import { BadgeInfo } from "lucide-react";
// import { getTicketInfo } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const { cast, socialCapitalValue, price } = castData;

  const timeSince = getTimeSince(
    Math.floor(new Date(cast.timestamp).getTime()).toString()
  );

  const embeds = cast.embeds.map((embed: any) => {
    if (embed.metadata) return embed.metadata.content_type.split("/")[0];
    return "quote";
  });

  // const [ticketInfo, setTicketInfo] = useState<any>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await getTicketInfo(cast);
  //     setTicketInfo(res);
  //     console.log(ticketInfo);
  //   };
  //   fetchData();
  // }, []);

  return (
    <Link
      href={`https://warpcast.com/${cast.author.username}/${cast.hash}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex" key={cast.hash}>
        <Avatar className="mr-3 shrink-0 sm:h-11 sm:w-11 h-10 w-10">
          <AvatarImage src={cast.author.pfp_url} />
          <AvatarFallback>@{cast.author.username}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-black w-full">
          <div className="flex justify-between items-center mb-1 text-md">
            <div className="flex flex-wrap items-center">
              <p className="font-semibold mr-1">{cast.author.display_name}</p>
              <p className="font-medium text-gray-600">
                @{cast.author.username} · {timeSince}
              </p>
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs flex self-end items-center justify-center px-2 py-1 bg-gradient-to-r from-[#45A3B8] to-[#23B68A] text-white font-semibold rounded">
                    {socialCapitalValue}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Social Capital Value represents Lorem Ipsum.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="font-medium pr-10 line-clamp-3 mb-2 text-sm">
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
            {showPrice && <div className="flex items-center gap-1 text-md text-black font-bold py-1 px-2 bg-slate-400 rounded justify-center">
              <Image
                src="/eth-logo.png"
                width={17}
                height={17}
                alt="Ethereum logo"
              />
              <span className="text-clip">{price}</span>
            </div>}
          </div>
        </div>

      </div>
    </Link>
  );
};

export default CastPreview;
