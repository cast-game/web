"use client";
import Image from "next/image";
import CastPreview from "./components/CastPreview";
import { useEffect, useState } from "react";
import {
  getActiveCasts,
  getCasts,
  getDetails,
  getSCVQuery,
  handleSCVData,
} from "@/lib/api";
import { useContext } from "react";
import { RoundContext } from "./context/provider";
import { CastData } from "@/lib/types";
import { fetchQuery, init } from "@airstack/airstack-react";
init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);

const Home = () => {
  const round = useContext(RoundContext);
  const endsIn = "-";

  const [sortBy, setSortBy] = useState("score");
  const [details, setDetails] = useState({
    rewardPool: "0",
    transactionCount: 0,
    userCount: 0,
  });
  const [casts, setCasts] = useState<CastData[] | null>(null);

  const fetchData = async () => {
    const response = await getDetails();
    setDetails(response);

    const activeCastDetails = await getActiveCasts();
    const activeCasts = await getCasts(
      activeCastDetails.map((c: any) => c.castHash)
    );

    const castHashes = activeCastDetails.map((c: any) => c.castHash);

    const { data, error } = await fetchQuery(getSCVQuery(castHashes));
    const castScores = handleSCVData(data.FarcasterCasts.Cast).sort(
      (a: any, b: any) => b.score - a.score
    );

    setCasts(
      castScores.map((c: any, i: number) => {
        const price = activeCastDetails.find(
          (cast: any) => cast.castHash === c.hash
        ).price;
        const cast = activeCasts.find((cast: any) => cast.hash === c.hash);

        return {
          socialCapitalValue: c.score,
          price,
          cast,
        };
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-center text-black">
      <div className="flex rounded items-center justify-center w-full flex-col p-8 bg-slate-200 rounded">
        <h1 className="text-3xl font-bold">{round?.title}</h1>

        <div className="flex items-center gap-4 my-7">
          <div className="flex flex-col items-center rounded px-6 py-3 bg-slate-300 rounded">
            <div className="flex items-center gap-2">
              <Image
                src="/eth-logo.png"
                width={27}
                height={27}
                alt="Ethereum logo"
              />
              <span className="text-3xl font-bold">{details.rewardPool}</span>
            </div>
            <span className="text-lg">reward pool</span>
          </div>

          <div className="flex flex-col items-center px-6 py-3 bg-slate-300 rounded">
            <span className="text-3xl font-bold">
              {details.transactionCount}
            </span>
            <span className="text-lg">transactions</span>
          </div>

          <div className="flex flex-col items-center px-6 py-3 bg-slate-300 rounded">
            <span className="text-3xl font-bold">{details.userCount}</span>
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
        {casts && (
          <div className="flex-col pt-6 space-y-4">
            {casts.map((castData: CastData, i: number) => (
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
                key={castData.cast.hash}
              >
                <CastPreview castData={castData} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
