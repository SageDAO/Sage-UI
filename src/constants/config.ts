import { Configuration, Parameters } from './types';

export const DEFAULT_PROFILE_PICTURE = '/branding/sage-icon.svg';

var env = process.env.NEXT_PUBLIC_APP_MODE;

const configuration: Configuration = {
  localhost: {
    CHAIN_ID: '5',
    NETWORK_NAME: 'goerli',
    SUBGRAPH_URL: 'https://api.studio.thegraph.com/query/28124/sage-rinkeby/v0.0.10',
    MEDIUM_URL: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@SAGE_WEB3',
    MARKETPLACE_ADDRESS: '0x11049f4231B8D32403821B8A157325E2B0FB6cab',
    STORAGE_ADDRESS: '0xd03ecE827177d7D7ACA0EF6065A605abcAF62d22',
    NFTFACTORY_ADDRESS: '0xfD2126F97519b90B81196373178E0b97AcD0CDC4',
    LOTTERY_ADDRESS: '0xBB8022c7235d456252eC1B40C65DB5F4B7123F2D',
    REWARDS_ADDRESS: '0xC1F9787079a83E444836450b8f3b31A9D5D3cBad',
    AUCTION_ADDRESS: '0xC99A4a7a2222fcdc488D15Bda9f9A95D4f59bF0C',
    ASHTOKEN_ADDRESS: '0x4afD23683118561B39084Cc26BaE966e03033174', // MOCK Contract
    APP_URL: 'http://localhost:3000/',
  },
  dev: {
    CHAIN_ID: '5',
    NETWORK_NAME: 'goerli',
    SUBGRAPH_URL: 'https://api.studio.thegraph.com/query/28124/sage-rinkeby/v0.0.10',
    MEDIUM_URL: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@SAGE_WEB3',
    MARKETPLACE_ADDRESS: '0x11049f4231B8D32403821B8A157325E2B0FB6cab',
    STORAGE_ADDRESS: '0xd03ecE827177d7D7ACA0EF6065A605abcAF62d22',
    NFTFACTORY_ADDRESS: '0x3B268D390fE9c9Ca937D28c12ADB341Cf4fa64F0',
    LOTTERY_ADDRESS: '0xBB8022c7235d456252eC1B40C65DB5F4B7123F2D',
    REWARDS_ADDRESS: '0xC1F9787079a83E444836450b8f3b31A9D5D3cBad',
    AUCTION_ADDRESS: '0xC99A4a7a2222fcdc488D15Bda9f9A95D4f59bF0C',
    ASHTOKEN_ADDRESS: '0x4afD23683118561B39084Cc26BaE966e03033174', // MOCK Contract
    APP_URL: 'https://sage-dev.vercel.app/',
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
    APP_URL: 'https://sage-staging.vercel.app/',
  },
  production: {
    CHAIN_ID: '1',
    NETWORK_NAME: 'mainnet',
    SUBGRAPH_URL: 'https://api.studio.thegraph.com/query/28124/sage-rinkeby/v0.0.10',
    MEDIUM_URL: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@SAGE_WEB3',
    MARKETPLACE_ADDRESS: '',
    STORAGE_ADDRESS: '0xEc620c97C0c2f893e6D86B8C0008B654fA738a9e',
<<<<<<< HEAD
    NFTFACTORY_ADDRESS: '0x12abc7c2Fbe0454EAea59A09873B16a3c85209C6',
=======
    NFTFACTORY_ADDRESS: '0x4A33B3F83268180cAf3CC4A66FA1977ad2551051',
>>>>>>> dev
    LOTTERY_ADDRESS: '0xFCCCed6439ab16313B39048019aA50566d6bd72b',
    REWARDS_ADDRESS: '0x9faC40CA206b61e48AdC5c440d5dcbCc5F9beE35',
    AUCTION_ADDRESS: '0x78209A2985595ff3128Fc69291b51443f918d636',
    ASHTOKEN_ADDRESS: '0x64D91f12Ece7362F91A6f8E7940Cd55F05060b92', // MOCK Contract
    APP_URL: 'https://www.sage.art/',
  },
};

export const parameters: Parameters = configuration[env as string];
