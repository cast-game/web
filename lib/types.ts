import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export interface CastData {
  cast: Cast;
  value: number;
  price?: number;
  balance?: number;
}

export interface TicketData {
  castHash: string;
  price: number;
  value: number;
  createdTime: number;
}