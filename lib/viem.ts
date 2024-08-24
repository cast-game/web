import {
  createPublicClient,
  http,
} from "viem";
import { base, baseSepolia } from "viem/chains";

export const chain = process.env.USE_MAINNET === "true" ? base : baseSepolia;

export const client = createPublicClient({
  chain,
  transport: http(),
});