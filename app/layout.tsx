import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "./components/Navbar";
import { RoundProvider } from "./context/round";
import { PrismaClient } from "@prisma/client";

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
    <RoundProvider value={currentRound}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen font-sans antialiased",
            fontSans.variable
          )}
        >
          <Navbar />
          <main className="flex pt-20 justify-center">
            <div className="max-w-4xl p-5">{children}</div>
          </main>
        </body>
      </html>
    </RoundProvider>
  );
}
