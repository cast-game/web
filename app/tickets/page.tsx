"use client";
import Image from "next/image";
import Casts from "@/lib/casts";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { useState } from "react";
import { formatEther } from "viem";
import CastPreview from "../components/CastPreview";

const Tickets = () => {
  const [casts, setCasts] = useState<Cast[] | null>(Casts as unknown as Cast[]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 max-w-4xl">
        {casts?.map((cast: Cast, i: number) => {
          return (
            <div className="p-3 bg-zinc-300 rounded" key={i}>
              <div className="flex items-center text-black justify-between">
                <div className="flex items-center text-lg font-bold">
                  <div className="flex gap-3 items-center">
                    <div className="flex text-xl items-center gap-1 text-black font-bold py-1 px-3 bg-black/20 rounded justify-center">
                      <Image
                        src="/eth-logo.png"
                        width={20}
                        height={20}
                        alt="Ethereum logo"
                      />
                      <span>2.1</span>
                    </div>
                    <span className="text-lime-600">+100%</span>
                  </div>
                </div>
                <span className="text-lg font-bold">2x</span>
              </div>
              <div
                className={`p-4 rounded bg-slate-200 w-full mt-3`}
                key={cast.hash}
              >
                <CastPreview cast={cast} showPrice={false} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tickets;
