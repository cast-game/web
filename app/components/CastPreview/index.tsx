import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Embed } from "./Embed";
import type { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";

interface Props {
  cast: Cast;
}

const CastPreview = ({ cast }: Props) => {
  console.log({cast})

  return (
    <div className="flex flex-col gap-2 flex-row items-start" key={cast.hash}>
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={cast.author.pfp_url} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{cast.author.display_name}</p>
          <p className="text-slate-400">@{cast.author.username} · </p>
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
    </div>
  );
};

export default CastPreview;
