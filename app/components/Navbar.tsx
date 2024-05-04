"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="p-3 flex justify-between items-center">
      <Link href="https://warpcast.com/~/channel/tiser" target="blank">
        <Image src="/logo.png" alt="Tiser Logo" width={45} height={45} className="rounded-full"/>
      </Link>
      <div className="flex gap-5 items-center">
        <Link href="/">Leaderboard</Link>
        <Link href="/activity">Activity</Link>
        <Link href="/tickets">My Tickets</Link>
        <Button>Sign In With Warpcast</Button>
      </div>
    </nav>
  );
};

export default Navbar;
