import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { cn } from "@/lib/utils";
import Navbar from "./components/Navbar";
import { ProviderWrapper } from "./context/provider";
import { PrismaClient } from "@prisma/client";
import { Analytics } from "@vercel/analytics/react";

const prisma = new PrismaClient();

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "cast.game",
	description:
		"A prediction game to win $ by betting on casts in a Farcaster channel",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const currentRound = await prisma.round.findFirst({
		orderBy: {
			id: "desc",
		},
	});

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
			>
				<ProviderWrapper value={currentRound}>
					<Navbar />
					<main className="flex pt-20 justify-center">
						<div className="max-w-3xl w-full sm:p-5">{children}</div>
					</main>
				</ProviderWrapper>
				<Analytics />
			</body>
		</html>
	);
}
