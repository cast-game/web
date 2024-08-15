"use client";
import { Round } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";

export const RoundContext = createContext<Round | null>(null);

type Props = {
	children: ReactNode;
	value: Round | null;
};

export const ProviderWrapper = ({ children, value }: Props) => {
	const [round] = useState<Round | null>(value);

	return (
		<RoundContext.Provider value={round}>
			<PrivyProvider
				appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
			>
				{children}
			</PrivyProvider>
		</RoundContext.Provider>
	);
};
