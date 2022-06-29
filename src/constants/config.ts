import { Configuration, Parameters } from './types';

export const DEFAULT_PROFILE_PICTURE =
  'data:image/png;base64,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';

var env = process.env.NEXT_PUBLIC_APP_MODE;

const configuration: Configuration = {
  rinkeby: {
    CHAIN_ID: '4',
    NETWORK_NAME: 'rinkeby',
    SUBGRAPH_URL: 'https://api.studio.thegraph.com/query/28124/sage-rinkeby/v0.0.5',
    LOTTERY_ADDRESS: '0x5402789d5454E9376dEeAD3876f9031c70b21C2a',
    AUCTION_ADDRESS: '0xb3a93b968147E2591e107c2Ba3dcEEcFD9c78532',
    REWARDS_ADDRESS: '0xAb35e1ed507aCBd0CBDacF50837476E61Eb57Abf',
    ASHTOKEN_ADDRESS: '0xd7315632731b7be8c618dE4374433f7C7E37A1D8', // MOCK Contract
  },
  dev: {
    CHAIN_ID: '4',
    NETWORK_NAME: 'rinkeby',
    SUBGRAPH_URL: 'https://api.studio.thegraph.com/query/28124/sage-rinkeby/v0.0.5',
    LOTTERY_ADDRESS: '0x5402789d5454E9376dEeAD3876f9031c70b21C2a',
    AUCTION_ADDRESS: '0xb3a93b968147E2591e107c2Ba3dcEEcFD9c78532',
    REWARDS_ADDRESS: '0xe15E098CBF9f479Dba9cC7450b59E0e7bf1596B1',
    ASHTOKEN_ADDRESS: '0xd7315632731b7be8c618dE4374433f7C7E37A1D8', // MOCK Contract
  },
};

export const parameters: Parameters = configuration[env as string];
