import { chain } from "wagmi";

type networks = keyof typeof chain
export interface Parameters {
  CHAIN_ID: string;
  NETWORK_NAME: networks;
  SUBGRAPH_URL: string;
  LOTTERY_ADDRESS: string;
  AUCTION_ADDRESS: string;
  REWARDS_ADDRESS: string;
}

export interface Configuration {
  [environment: string]: Parameters;
}
