import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Embed } from "./Embed";
import type { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { getTimeSince } from "@/lib/helpers";
import { Heart, Ticket } from "lucide-react";

interface Props {
  cast: Cast;
}

const CastPreview = ({ cast }: Props) => {
  console.log(cast);
  const timeSince = getTimeSince(cast.timestamp);

  return (
    <div className="flex flex-col gap-2 flex-row items-start" key={cast.hash}>
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={cast.author.pfp_url} />
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
      <div className="flex gap-6">
        <div className="flex items-center text-sm gap-2 text-slate-400 font-semibold">
          <Heart size={20} color="#c93131" fill={"#c93131"} />
          <span>{cast.reactions.likes_count}</span>
        </div>
        <div className="flex items-center text-sm gap-2 text-slate-400 font-semibold">
          <Ticket size={20} color="#e3e3e3" fill={"#707070"} />
          <span>-</span>
        </div>
      </div>
    </div>
  );
};

export default CastPreview;
