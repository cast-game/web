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
		<Card className="relative bg-black/50">
			<CardHeader>
				<CardTitle>Current Prize Pool:</CardTitle>
			</CardHeader>
			<CardContent>
				<span className="text-5xl font-bold">{prizePoolBalance} $DEGEN</span>
				<div className="flex justify-between items-center">
					<div className="flex flex-col items-end text-lg">
						<div className="flex flex-col items-end text-slate-400 absolute top-5 right-7">
							<span>
								Round ends in{" "}
								<span className="text-white font-semibold">
									{formatTimeRemaining(deadline)}
								</span>
							</span>
							<span className="text-slate-400">
								Tickets bought:{" "}
								<span className="text-white font-semibold">{tradeCount}</span>
							</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default OverviewCard;
