"use client";
import { Round } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { Theme } from '@radix-ui/themes';

export const RoundContext = createContext<Round | null>(null);

type Props = {
	children: ReactNode;
	value: Round | null;
};

export const ProviderWrapper = ({ children, value }: Props) => {
	const [round] = useState<Round | null>(value);

	return (
		<RoundContext.Provider value={round}>
			<PrivyProvider appId={"clztmdwbq0c1h7bcas8l3doz6"}>
				<Theme
					hasBackground={false}
					appearance="dark"
				>{children}</Theme>
			</PrivyProvider>
		</RoundContext.Provider>
	);
};
