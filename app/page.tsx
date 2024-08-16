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
  const [details, setDetails] = useState<any>(null);
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
    <div className="flex flex-col text-black px-4 sm:px-8 w-full">
			<span className="text-xl font-medium text-slate-300 mb-6">{round?.title}</span>
      <div className="flex flex-wrap rounded items-stretch gap-3">
        <StatBox
          label="reward pool"
          value={
            details ? (
              <div className="flex items-center gap-2">
                <Image
                  src="/eth-logo.png"
                  width={25}
                  height={25}
                  alt="Ethereum logo"
                />
                <span className="text-2xl font-bold">{details.rewardPool}</span>
              </div>
            ) : null
          }
        />

        <StatBox label="transactions" value={details?.transactionCount} />

        <StatBox label="participants" value={details?.userCount} />

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-3 bg-slate-200 rounded min-w-[150px]">
          {details ? (
            <span className="text-2xl font-bold">23:59:59</span>
          ) : (
            <div className="h-7 w-full bg-grey-300 animate-pulse rounded"></div>
          )}
          <span className="text-md">game ends</span>
        </div>
      </div>

      <div className="mt-6 sm:mt-10 gap-4">
        <div className="flex flex-row items-center gap-3 text-slate-300">
          <span className="text-xl font-medium">Top Casts</span>
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
        {casts ? (
          <div className="flex flex-col pt-6 space-y-4">
            {casts.map((castData: CastData, i: number) => (
              <div
                key={castData.cast.hash}
                className="p-3 rounded hover:bg-slate-100 bg-slate-200 hover:outline outline-4 outline-purple-700"
              >
                <CastPreview castData={castData} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col pt-6 space-y-4">
            <div className="h-24 bg-slate-500/50 animate-pulse rounded"></div>
            <div className="h-24 bg-slate-500/50 animate-pulse rounded"></div>
            <div className="h-24 bg-slate-500/50 animate-pulse rounded"></div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatBoxProps {
  label: string;
  value: any;
}

const StatBox = ({ label, value }: StatBoxProps) => (
  <div className="flex flex-col items-center justify-center px-6 py-4 bg-slate-200 rounded flex-1 min-w-[150px]">
    {value !== undefined ? (
      <span className="text-2xl font-bold">{value}</span>
    ) : (
      <div className="h-9 w-full bg-grey-300 animate-pulse rounded"></div>
    )}
    <span className="text-md">{label}</span>
  </div>
);

export default Home;
