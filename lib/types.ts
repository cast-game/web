import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export interface CastData {
  cast: Cast;
  socialCapitalValue: number;
  price?: number;
  balance?: number;
}