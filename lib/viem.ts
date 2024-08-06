import {
  createPublicClient,
  http,
  getContract,
  keccak256,
  encodePacked,
  zeroAddress,
} from "viem";
import { base, baseSepolia } from "viem/chains";
import { gameAddress } from "./constants";
import GAME_ABI from "./abi";

export const chain = process.env.USE_MAINNET === "true" ? base : baseSepolia;

export const client = createPublicClient({
  chain,
  transport: http(),
});

export const gameContract = getContract({
  address: gameAddress,
  abi: GAME_ABI,
  client,
});