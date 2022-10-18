import { Configuration, Parameters } from './types';

export const DEFAULT_PROFILE_PICTURE = '/branding/sage-icon.svg';

var env = process.env.NEXT_PUBLIC_APP_MODE;

const configuration: Configuration = {
  dev: {
    CHAIN_ID: '5',
    NETWORK_NAME: 'goerli',
    SUBGRAPH_URL: 'https://api.studio.thegraph.com/query/28124/sage-rinkeby/v0.0.10',
    MEDIUM_URL: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@SAGE_WEB3',
    MARKETPLACE_ADDRESS: '0xC5EDeD729aC29D3e88aA671C53854742675feedD',
    STORAGE_ADDRESS: '0x4F5DBa5A3B2fD077095ab3B1e013EfAE2e23071E',
    NFTFACTORY_ADDRESS: '0x6bB46A81deC68B5cAc9ec566FcAb6af8BC2c3E20',
    LOTTERY_ADDRESS: '0x95478449627834F036215b3C9A02aF836C7b30fE',
    REWARDS_ADDRESS: '0xc29b6257737F76B262921df5241E86d199426d97',
    AUCTION_ADDRESS: '0xDDCc4a401E6E32d349b5De50DcD2dE8fa43894B3',
    ASHTOKEN_ADDRESS: '0x4afD23683118561B39084Cc26BaE966e03033174', // MOCK Contract
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
