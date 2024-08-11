"use client";
import { Round } from "@prisma/client";
import { createContext, ReactNode, useEffect, useState } from "react";

export const RoundContext = createContext<Round | null>(null);

type Props = {
  children: ReactNode;
  value: Round | null;
};

export const RoundProvider = ({ children, value }: Props) => {
  const [round] = useState<Round | null>(value);

  return (
    <RoundContext.Provider value={round}>{children}</RoundContext.Provider>
  );
};
