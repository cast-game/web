"use client";
import { useState } from "react";
import OverviewCard from "./OverviewCard";

const Leaderboard = () => {
  const [sortBy, setSortBy] = useState("likes");

  return (
    <div className="flex flex-col justify-center px-20 w-full max-w-5xl h-full mt-5">
      <OverviewCard />
      <div className="mt-12">
        <div className="flex items-center gap-5 text-slate-300">
          <span className="text-2xl font-medium">Top Casts</span>
          <div className="flex cursor-pointer gap-3">
            <span
              onClick={() => setSortBy("likes")}
              className={`${sortBy === "price" ? "opacity-65" : ""} hover:text-white`}
            >
              by likes
            </span>
            <span
              onClick={() => setSortBy("price")}
              className={`${sortBy === "likes" ? "opacity-65" : ""} hover:text-white`}
            >
              by price
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
