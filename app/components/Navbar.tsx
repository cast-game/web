import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getChannel } from "@/lib/api";


const Navbar = async () => {
  const channelId = "memes";
  const channel = await getChannel(channelId);

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
        <Link href="/">Game</Link>
        <Link href="/activity">Activity</Link>
        <Link href="/tickets">My Tickets</Link>
        <Button>Sign In With Warpcast</Button>
      </div>
    </nav>
  );
};

export default Navbar;
