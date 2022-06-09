import { ethers } from "ethers";
import { chain } from "wagmi";

type networks = keyof typeof chain
export interface Parameters {
  CHAIN_ID: string;
  NETWORK_NAME: networks;
  LOTTERY_ADDRESS: string;
  AUCTION_ADDRESS: string;
  REWARDS_ADDRESS: string;
}

export interface Configuration {
  [environment: string]: Parameters;
}
