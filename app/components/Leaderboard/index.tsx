"use client";
import { useEffect, useState } from "react";
import OverviewCard from "./OverviewCard";
import type { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import CastPreview from "../CastPreview";
import { getCasts } from "@/lib/api";

const Leaderboard = () => {
  const [sortBy, setSortBy] = useState("likes");
  const [casts, setCasts] = useState<Cast[]>([]);

  const fetchCasts = async () => {
    const response = await getCasts(["0x02d3f308a0f56aa39766d9f66d5c40c9aefb47f9"]);
    setCasts(response);
  };

  useEffect(() => {
    fetchCasts();
  }, []);

  return (
    <div className="flex flex-col justify-center px-20 w-full max-w-5xl h-full mt-5">
      <OverviewCard />
      <div className="mt-12 gap-4">
        <div className="flex items-center gap-5 text-slate-300">
          <span className="text-2xl font-medium">Top Casts</span>
          <div className="flex cursor-pointer gap-3">
            <span
              onClick={() => setSortBy("likes")}
              className={`${
                sortBy === "price" ? "opacity-65" : ""
              } hover:text-white`}
            >
              by likes
            </span>
            <span
              onClick={() => setSortBy("price")}
              className={`${
                sortBy === "likes" ? "opacity-65" : ""
              } hover:text-white`}
            >
              by price
            </span>
          </div>
        </div>
        <div className="flex-col">{casts.map((cast: Cast) => (
          <CastPreview key={cast.hash} cast={cast} />
        ))}</div>
      </div>
    </div>
  );
};

export default Leaderboard;
