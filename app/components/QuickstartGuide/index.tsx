import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickstartGuideProps {
	children: React.ReactNode;
}

const pages = [
	{
		title: "What is this?",
		content: (
			<>
				<p>
					cast.game is like a stock market for posts on Farcaster: buy “shares”
					in casts (<b>cast tickets</b>) you think will trend, and win rewards
					if they become the most popular.
				</p>
				<p>
					A round of cast.game runs in a specific Farcaster channel over 48
					hours:
				</p>
				<ul className="list-disc pl-5 space-y-2">
					<li>
						During the first 24 hours, users can trade cast tickets for any new
						posts in the channel.
					</li>
					<li>
						Then, trading closes and everyone waits another 24 hours to see
						which casts gain the highest{" "}
						<a
							href="https://docs.airstack.xyz/airstack-docs-and-faqs/abstractions/social-capital-value-and-social-capital-scores"
							target="_blank"
							rel="noopener noreferrer"
							className="font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer"
						>
							Cast Scores
						</a>
						.
					</li>
				</ul>
				<p>
					At the end, the reward pool is distributed among the creators and
					ticket holders of the <b>top 3 casts</b>.
				</p>
			</>
		),
	},
	{
		title: "Get started",
		content: (
			<>
				<p>
					The frame will be your trading interface,{" "}
					<a
						href="https://cast.game/action"
						target="_blank"
						rel="noopener noreferrer"
						className="font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer"
					>
						install the Cast Action
					</a>{" "}
					to use it.
				</p>
				<p>
					Trigger the action on any eligible cast (created during the round in
					the correct channel) to buy or sell tickets on a bonding curve.
				</p>
				<p>
					More popular creators will have higher priced tickets to ensure fairer
					competition.
				</p>
			</>
		),
	},
	{
		title: "Dashboard",
		content: (
			<>
				<p>This web app will provide you with an overview of the game.</p>
				<p>
					You can view stats, top casts, trading activity and your purchased
					tickets.
				</p>
				<p>
					Finally, make sure to follow{" "}
					<a
						href="https://cast.game/channel"
						target="_blank"
						rel="noopener noreferrer"
						className="font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer"
					>
						/castgame
					</a>{" "}
					for important announcements and live updates about the game.
				</p>
				<p>Have fun predicting bangers!</p>
			</>
		),
	},
];
const QuickstartGuide: React.FC<QuickstartGuideProps> = ({ children }) => {
	const [page, setPage] = useState(0);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open) {
			setPage(0);
		}
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="bg-slate-100 text-black min-h-[500px] overflow-y-auto flex flex-col">
				<DialogHeader>
					<DialogTitle className="text-2xl">{pages[page].title}</DialogTitle>
				</DialogHeader>
				<div className="flex-grow overflow-y-auto">
					<div className="grid gap-4 pb-4">{pages[page].content}</div>
				</div>
				<DialogFooter className="mt-auto">
					<div className="flex justify-between items-center w-full">
						<div className="w-10 h-10">
							{page > 0 && (
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setPage(page - 1)}
								>
									<ArrowLeft className="h-5 w-5" />
								</Button>
							)}
						</div>
						<div className="flex space-x-2">
							{pages.map((_, index) => (
								<div
									key={index}
									className={`w-2 h-2 rounded-full ${
										index === page ? "bg-black" : "bg-gray-300"
									}`}
								/>
							))}
						</div>
						<div className="w-10 h-10">
							{page < pages.length - 1 && (
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setPage(page + 1)}
								>
									<ArrowRight className="h-5 w-5" />
								</Button>
							)}
						</div>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default QuickstartGuide;
