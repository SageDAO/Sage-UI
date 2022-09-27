import { Configuration, Parameters } from './types';

export const DEFAULT_PROFILE_PICTURE = '/branding/sage-icon.svg';

var env = process.env.NEXT_PUBLIC_APP_MODE;

const configuration: Configuration = {
  dev: {
    CHAIN_ID: '5',
    NETWORK_NAME: 'goerli',
    SUBGRAPH_URL: 'https://api.studio.thegraph.com/query/28124/sage-rinkeby/v0.0.10',
    MEDIUM_URL: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@SAGE_WEB3',
    LOTTERY_ADDRESS: '0xa3219F75fb49F0Ee7376511e7104ca61db3bb974',
    AUCTION_ADDRESS: '0x18e981161b2021392B3F2D844793eE50A52f8232',
    REWARDS_ADDRESS: '0x29292dbA15c6DeDb50aFD8B8CaF1C30A74331768',
    ASHTOKEN_ADDRESS: '0x4afD23683118561B39084Cc26BaE966e03033174', // MOCK Contract
    NFTFACTORY_ADDRESS: '0x3C3920be49eab5F949f9Fd332E458f1f4F092E8f',
    MARKETPLACE_ADDRESS: '0x40DC903878049BF2ca14E43eD422b9947c97bBD9',
    STORAGE_ADDRESS: '0xF615Ea96BEac2C8f0B3a467474D4c5d89E1CE0Bb',
  },

  staging: {
    CHAIN_ID: '4',
    NETWORK_NAME: 'rinkeby',
    SUBGRAPH_URL: 'https://api.studio.thegraph.com/query/28124/sage-rinkeby/v0.0.9',
    MEDIUM_URL: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@SAGE_WEB3',
    LOTTERY_ADDRESS: '0x86295B8B322dBCA2f132FDb6390BbcEBd6573Ed4',
    AUCTION_ADDRESS: '0x26b5bB9352edbe338ef77cF90c69cB2a715974e1',
    REWARDS_ADDRESS: '0xAb35e1ed507aCBd0CBDacF50837476E61Eb57Abf',
    ASHTOKEN_ADDRESS: '0xd7315632731b7be8c618dE4374433f7C7E37A1D8', // MOCK Contract
    NFTFACTORY_ADDRESS: '0x8a26e829c3387bB933d295E70FC5Eb29A9f25841',
    MARKETPLACE_ADDRESS: '0xEfbc3Af631Db2a6F94C2c6336A02b08480e12A61',
    STORAGE_ADDRESS: '0xACb2d936daD56A254a037E28e80BB42Cd86cC042',
  },
};

export const parameters: Parameters = configuration[env as string];
