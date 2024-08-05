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

interface Props {
  cast: Cast;
}

const CastPreview = ({ cast }: Props) => {
  const timeSince = getTimeSince(cast.timestamp);

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
    >
      <div className="flex gap-4 items-center justify-between">
        <div className="flex flex-row w-full justify-between" key={cast.hash}>
          <div className="flex">
            <Avatar className="mr-3">
              <AvatarImage src={cast.author.pfp_url} height={20} width={20} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-black">
              <div className="flex">
                <p className="font-semibold mr-1.5">
                  {cast.author.display_name}
                </p>
                <p className="font-medium">
                  @{cast.author.username} · {timeSince}
                </p>
              </div>
              <p className="font-medium pr-3 line-clamp-3 mb-2">
                {cast.text.replace(/https?:\/\/\S+/i, "")}
              </p>
              <div className="flex gap-2">
                {embeds.map((embed: string) => {
                  return (
                    <div className="flex items-center font-medium rounded-full px-3 py-1 text-sm bg-black/20">
                      + {embed}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm flex self-end items-center justify-center mb-2 px-3 py-1 bg-gradient-to-r from-[#45A3B8] to-[#23B68A] text-white font-semibold rounded-full">
                    21.35
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Social Capital Value represents Lorem Ipsum.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex text-xl items-center gap-1 text-black font-bold py-1 px-3 bg-black/20 rounded justify-center">
              <Image
                src="/eth-logo.png"
                width={20}
                height={20}
                alt="Ethereum logo"
              />
              <span>2.1</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CastPreview;
