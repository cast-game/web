"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { getCasts, getUsers, queryData } from "@/lib/api";
import CastPreview from "../components/CastPreview";
import { formatEther } from "viem";
import { getTimeSince } from "@/lib/helpers";

const Activity = () => {
  const [casts, setCasts] = useState<Cast[] | null>();
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState<any>(null);

  const fetchData = async () => {
    const response = await queryData(`{
      transactions {
        items {
          castHash
          price
          sender
          timestamp
          type
        }
      }
    }`);
    setTransactions(
      response.transactions.items.sort(
        (a: any, b: any) => b.timestamp - a.timestamp
      )
    );

    const castsRes = await getCasts(
      response.transactions.items.map((tx: any) => tx.castHash)
    );
    setCasts(castsRes);

    const addresses = Array.from(
      new Set(response.transactions.items.map((tx: any) => tx.sender))
    ) as string[];

    const usersRes = await getUsers(addresses);
    setUsers(usersRes);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center">
      {casts && users && (
        <div className="flex flex-col gap-4 max-w-4xl">
          {transactions.map((tx: any, i: number) => {
            const cast = casts.find((cast) => cast.hash === tx.castHash)!;
            const sender = users[tx.sender.toLowerCase()][0];
            const timeSince = getTimeSince(tx.timestamp);

            return (
              <div className="p-3 bg-zinc-300 rounded" key={i}>
                <div className="flex items-center font-medium text-black justify-between">
                  <div className="flex items-center text-lg">
                    <a
                      href={`https://warpcast.com/${sender.username}`}
                      target="_black"
                    >
                      <div className="flex items-center cursor-pointer">
                        <Image
                          src={sender.pfp_url!}
                          width={35}
                          height={35}
                          alt={sender.username}
                          className="rounded-full"
                        />
                        <span className="font-bold mx-2">
                          @{sender.username}
                        </span>
                      </div>
                    </a>
                    <span>
                      purchased for <b>{formatEther(BigInt(tx.price))} ETH</b>
                    </span>
                  </div>
                  <span className="text-sm">{timeSince}</span>
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
      )}
    </div>
  );
};

export default Activity;
