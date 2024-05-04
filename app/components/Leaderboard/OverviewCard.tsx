"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTimeRemaining } from "@/lib/helpers";
import { useEffect, useState } from "react";

const OverviewCard = () => {
  const prizePoolBalance = 250871;
  const tradeCount = 1239;
  const deadline = 1714944818;

  const [timeRemaining, setTimeRemaining] = useState(
    formatTimeRemaining(deadline)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(deadline));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Current winner prize pool:</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-5xl font-bold text-indigo-300">
            {prizePoolBalance} $DEGEN
          </span>
          <div className="flex flex-col items-end text-lg">
            <span className="text-slate-400">
              Tickets traded:{" "}
              <span className="text-white font-semibold">{tradeCount}</span>
            </span>
            <span className="text-slate-400">
              Round ends in{" "}
              <span className="text-white font-semibold">
                {formatTimeRemaining(deadline)}
              </span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;