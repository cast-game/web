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
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6" key={cast.hash}>
        <div className="flex">
          <Avatar className="mr-3 shrink-0">
            <AvatarImage src={cast.author.pfp_url} />
            <AvatarFallback>@{cast.author.username}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-black sm:text-lg text-md">
            <div className="flex flex-wrap items-center">
              <p className="font-semibold mr-1.5">{cast.author.display_name}</p>
              <p className="font-medium text-gray-600">
                @{cast.author.username} · {timeSince}
              </p>
            </div>
            <p className="font-medium pr-3 line-clamp-3 mb-2">
              {cast.text.replace(/https?:\/\/\S+/i, "")}
            </p>
            <div className="flex flex-wrap gap-2">
              {embeds.map((embed: string) => (
                <div
                  key={embed}
                  className="flex items-center font-medium rounded-full px-3 py-1 text-sm bg-black/20"
                >
                  + {embed}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex md:flex-col items-center sm:justify-between justify-end ml-3 gap-3 md:gap-0">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm flex self-end items-center justify-center sm:mb-2 px-3 py-1 bg-gradient-to-r from-[#45A3B8] to-[#23B68A] text-white font-semibold rounded-full">
                  {socialCapitalValue}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Social Capital Value represents Lorem Ipsum.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {showPrice && (
            <div className="flex items-center gap-1 text-xl text-black font-bold py-1 px-3 bg-black/20 rounded justify-center">
              <Image
                src="/eth-logo.png"
                width={20}
                height={20}
                alt="Ethereum logo"
              />
              <span className="text-clip">{price}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
  
};

export default CastPreview;
