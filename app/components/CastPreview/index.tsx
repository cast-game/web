import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Embed } from "./Embed";
import type { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";

interface Props {
  cast: Cast;
}

const CastPreview = ({ cast }: Props) => {
  return (
    <div
      className="flex gap-4 sm:w-[500px] w-[350px] flex-row items-start"
      key={cast.hash}
    >
      <Avatar>
        <AvatarImage src={cast.author.pfp_url} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start w-full">
        <div className="flex gap-2">
          <p className="font-bold">{cast.author.display_name}</p>
          <p className="text-gray-600">@{cast.author.username}</p>
        </div>
        <p className="pb-2">{cast.text.replace(/https?:\/\/\S+/i, "")}</p>
        {cast.embeds && cast.embeds.length > 0 ? (
          <Embed _embedObject={cast.embeds[0]} />
        ) : null}
      </div>
    </div>
  );
};

export default CastPreview;