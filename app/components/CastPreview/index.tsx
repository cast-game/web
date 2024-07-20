// "use client"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  SmallAvatar,
} from "@/components/ui/avatar";
import { Embed } from "./Embed";
import type { Cast, User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { getTimeSince } from "@/lib/helpers";
import { BadgeInfo } from "lucide-react";
import { getTicketInfo } from "@/lib/api";
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
  const [ticketInfo, setTicketInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTicketInfo(cast);
      setTicketInfo(res);
      console.log(ticketInfo);
    };
    fetchData();
  }, []);

  return (
    <Link
      href={`https://warpcast.com/${cast.author.username}/${cast.hash}`}
      target="_blank"
    >
      <div className="flex gap-4 items-center justify-between">
        <div
          className="flex flex-col gap-2 flex-row items-start"
          key={cast.hash}
        >
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={cast.author.pfp_url} height={20} width={20} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{cast.author.display_name}</p>
              <p className="text-slate-400">
                @{cast.author.username} · {timeSince}
              </p>
            </div>
          </div>
          <div>
            <p className="pb-2 font-normal">
              {cast.text.replace(/https?:\/\/\S+/i, "")}
            </p>
            {/* {cast.embeds && cast.embeds.length > 0 ? (
          <Embed _embedObject={cast.embeds[0]} />
        ) : null} */}
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 opacity-85 hover:opacity-100">
                  <BadgeInfo size={22}/>
                  <span className="flex gap-6">SCV: 235.21</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Social Capital Value represents Lorem Ipsum.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-col items-end gap-2 text-sm text-slate-400">
          <span>Holders (32):</span>
          <div className="flex gap-1">
            {ticketInfo?.topHolders.map((user: User) => (
              <TooltipProvider key={user.username} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`https://warpcast.com/${user.username}`}
                      target="_blank"
                    >
                      <SmallAvatar>
                        <AvatarImage src={user.pfp_url} />
                        <AvatarFallback>FC</AvatarFallback>
                      </SmallAvatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>@{user.username}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <span>Ticket price:</span>
          <div className="flex items-center justify-center w-36 py-1.5 bg-purple-950 text-white font-semibold rounded-sm">
            {ticketInfo?.price} $DEGEN
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CastPreview;
