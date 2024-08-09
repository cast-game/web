"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { getCasts } from "@/lib/api";
import CastPreview from "../components/CastPreview";
import Casts from "@/lib/casts";

export default function Activity() {
  const [casts, setCasts] = useState<Cast[]>(Casts as Cast[]);

  // const fetchCasts = async () => {
  //   const response = await getCasts([
  //     "0x02d3f308a0f56aa39766d9f66d5c40c9aefb47f9",
  //     "0x5d4ef473e8826c5a13c4218a537953bd25ae5c9c",
  //   ]);
  //   setCasts(response);
  // };

  // useEffect(() => {
  //   fetchCasts();
  // }, []);

  return (
    <>
      <Navbar selection="Activity" />
      <div className="flex justify-center pt-20">
        <div className="flex flex-col gap-3 max-w-3xl">
          {casts.map((cast: Cast, i: number) => (
            <div className="p-3 bg-zinc-300 rounded" key={cast.hash}>
              <div className="flex items-center font-medium text-black justify-between">
                <div className="flex items-center text-lg">
                  <a href={`https://warpcast.com/dwr`} target="_black">
                    <div className="flex items-center hover:opacity-85 cursor-pointer">
                      <Image
                        src={cast.author.pfp_url!}
                        width={35}
                        height={35}
                        alt={cast.author.username}
                        className="rounded-full"
                      />
                      <span className="font-bold mx-2">@username</span>
                    </div>
                  </a>
                  <span>
                    purchased for <b>0.1 ETH</b>
                  </span>
                </div>
                <span className="text-sm">just now</span>
              </div>
              <div
                className={`p-4 rounded bg-slate-200 w-full mt-3`}
                key={cast.hash}
              >
                <CastPreview cast={cast} showPrice={false} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
