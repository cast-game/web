import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getChannel } from "@/lib/api";


const Navbar = async ({ selection }: { selection: string }) => {
  const channelId = "memes";
  const channel = await getChannel(channelId);

  const getLinkClass = (linkText: string) =>
    selection === linkText
      ? "opacity-100"
      : "opacity-70 hover:opacity-100 focus:opacity-100";

  return (
    <nav className="p-3 flex justify-between items-center absolute top-0 w-full">
      <div className="flex items-center ml-4 gap-2">
        <div className="rounded-full h-2 w-2 bg-green-500" />
        <Avatar className="h-5 w-5">
          <AvatarImage src={channel.image_url} />
        </Avatar>
        <span className="text-lg font-bold">/{channelId}</span>
      </div>
      <div className="flex gap-5 items-center">
        <Link href="/" className={getLinkClass("Overview")}>
          Overview
        </Link>
        <Link href="/activity" className={getLinkClass("Activity")}>
          Activity
        </Link>
        <Link href="/tickets" className={getLinkClass("My Tickets")}>
          My Tickets
        </Link>
        <Button>Sign In With Warpcast</Button>
      </div>
    </nav>
  );
};

export default Navbar;
