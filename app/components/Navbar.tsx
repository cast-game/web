"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getChannel } from "@/lib/api";
import { use, useEffect, useState } from "react";
import { Channel } from "@neynar/nodejs-sdk/build/neynar-api/v2";

const links = [
  { href: "/", label: "Overview" },
  { href: "/activity", label: "Activity" },
  { href: "/tickets", label: "My Tickets" },
];

const Navbar = () => {
  // TODO: get from db
  const pathname = usePathname();
  const channelId = "castgame";
  const [channel, setChannel] = useState<Channel | null>(null);

  const fetchChannel = async () => {
    const response = await getChannel(channelId);
    setChannel(response);
  };

  useEffect(() => {
    fetchChannel();
  }, []);
  
  return (
    <nav className="p-3 flex justify-between items-center absolute top-0 w-full">
      <a href={`https://warpcast.com/~/channel/${channel?.id}`} target="_black">
        <div className="flex items-center ml-4 gap-2">
          <div className="rounded-full h-2 w-2 bg-green-500" />
          <Image
            src={channel?.image_url!}
            alt={"/" + channel?.id}
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="text-lg font-bold">/{channelId}</span>
        </div>
      </a>
      <div className="flex gap-5 items-center">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={
              pathname === href
                ? "opacity-100"
                : "opacity-75 hover:opacity-100 focus:opacity-100"
            }
          >
            {label}
          </Link>
        ))}
        <a href="https://google.com">
          <div className="flex bg-indigo-600 rounded px-5 py-2 font-medium hover:bg-indigo-600/90">
            Sign In With Warpcast
          </div>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
