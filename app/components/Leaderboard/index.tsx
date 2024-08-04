"use client";
import { useEffect, useState } from "react";
import OverviewCard from "./OverviewCard";
import type { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { getCasts } from "@/lib/api";
import CastPreview from "../CastPreview";
// import { getCasts } from "@/lib/api";

const Leaderboard = () => {
  const [sortBy, setSortBy] = useState("score");
  const [casts, setCasts] = useState<Cast[]>([]);

  const fetchCasts = async () => {
    const response = await getCasts([
      "0x02d3f308a0f56aa39766d9f66d5c40c9aefb47f9",
      "0x5d4ef473e8826c5a13c4218a537953bd25ae5c9c",
    ]);
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
              onClick={() => setSortBy("score")}
              className={`${
                sortBy === "price" ? "opacity-65" : ""
              } hover:text-white`}
            >
              by score
            </span>
            <span
              onClick={() => setSortBy("price")}
              className={`${
                sortBy === "score" ? "opacity-65" : ""
              } hover:text-white`}
            >
              by price
            </span>
          </div>
        </div>
        <div className="flex-col pt-6 space-y-3">
          {casts.map((cast: Cast, i: number) => (
            <div
              className={`p-4 rounded bg-slate-200 ${
                i === 0 ? "border-amber-400" : i === 1 ? "border-slate-400" : i === 2 ? "border-yellow-700" : "border-slate-900"
              }`}
              key={cast.hash}
            >
              <CastPreview cast={cast} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
