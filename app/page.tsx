"use client";
import Image from "next/image";
import CastPreview from "./components/CastPreview";
import { useEffect, useState } from "react";
import { getCasts, getDetails } from "@/lib/api";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import Casts from "@/lib/casts";

const Home = () => {
  const gameTitle = "Testnet Demo Competition";
  const endsIn = "-";

  const [sortBy, setSortBy] = useState("score");
  const [data, setData] = useState({
    rewardPool: "0",
    transactionCount: 0,
    userCount: 0,
  });
  const [casts, setCasts] = useState<Cast[]>(Casts as unknown as Cast[]);

  const fetchData = async () => {
    const response = await getDetails();
    setData(response);

    // const response = await getCasts([
    //   "0x02d3f308a0f56aa39766d9f66d5c40c9aefb47f9",
    //   "0x5d4ef473e8826c5a13c4218a537953bd25ae5c9c",
    // ]);
    // setCasts(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-center text-black">
      <div className="flex rounded items-center justify-center w-full flex-col p-8 bg-slate-200 rounded">
        <h1 className="text-3xl font-bold">{gameTitle}</h1>

        <div className="flex items-center gap-4 my-7">
          <div className="flex flex-col items-center rounded px-6 py-3 bg-slate-300 rounded">
            <div className="flex items-center gap-2">
              <Image
                src="/eth-logo.png"
                width={27}
                height={27}
                alt="Ethereum logo"
              />
              <span className="text-3xl font-bold">{data.rewardPool}</span>
            </div>
            <span className="text-lg">reward pool</span>
          </div>

          <div className="flex flex-col items-center px-6 py-3 bg-slate-300 rounded">
            <span className="text-3xl font-bold">{data.transactionCount}</span>
            <span className="text-lg">transactions</span>
          </div>

          <div className="flex flex-col items-center px-6 py-3 bg-slate-300 rounded">
            <span className="text-3xl font-bold">{data.userCount}</span>
            <span className="text-lg">participants</span>
          </div>
        </div>

        <p className="text-xl font-medium">
          Ends in <span className="font-bold">{endsIn}</span>
        </p>
      </div>
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
                i === 0
                  ? "border-amber-400"
                  : i === 1
                  ? "border-slate-400"
                  : i === 2
                  ? "border-yellow-700"
                  : "border-slate-900"
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

export default Home;
