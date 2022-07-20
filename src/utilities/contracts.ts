import { BigNumber, Contract, ethers, Signer, utils } from 'ethers';
import { toast } from 'react-toastify';
import { parameters } from '@/constants/config';
import RewardsJson from '@/constants/abis/Rewards/Rewards.sol/Rewards.json';
import LotteryJson from '@/constants/abis/Lottery/Lottery.sol/Lottery.json';
import AuctionJson from '@/constants/abis/Auction/Auction.sol/Auction.json';
import SageNFTJson from '@/constants/abis/NFT/SageNFT.sol/SageNFT.json';
import NFTFactoryJson from '@/constants/abis/NFT/NFTFactory.sol/NFTFactory.json';
import MarketplaceJson from '@/constants/abis/Market/Marketplace.sol/Marketplace.json';
import ERC20StandardJson from '@/constants/abis/ERC-20/ERC20Standard.json';
import {
  Lottery as LotteryContract,
  Auction as AuctionContract,
  Rewards as RewardsContract,
  ERC20Standard as ERC20Contract,
  SageNFT as NftContract,
  NFTFactory as NftFactoryContract,
  Marketplace as MarketplaceContract,
} from '@/types/contracts';

const {
  REWARDS_ADDRESS,
  ASHTOKEN_ADDRESS,
  LOTTERY_ADDRESS,
  AUCTION_ADDRESS,
  NFTFACTORY_ADDRESS,
  MARKETPLACE_ADDRESS,
  NETWORK_NAME,
  CHAIN_ID,
} = parameters;

export type SignerOrProvider = Signer | Signer['provider'];

var ContractFactory = (function () {
  var instances = new Map<string, Contract>();
  async function createInstance(address: string, abi: any) {
    console.log(`Creating contract instance for address ${address}`);
    const contract = new ethers.Contract(
      address,
      abi,
      new ethers.providers.InfuraProvider(
        { name: NETWORK_NAME, chainId: +CHAIN_ID },
        process.env.INFURA_ID
      )
    );
    instances.set(address, contract);
    return contract;
  }
  return {
    getInstance: async function (address: string, abi: any) {
      const existingContract = instances.get(address);
      if (!existingContract) {
        let contract = await createInstance(address, abi);
        instances.set(address, contract);
        return contract;
      }
      return existingContract;
    },
  };
})();

export async function getLotteryContract(signer?: Signer): Promise<LotteryContract> {
  return (await getContract(LOTTERY_ADDRESS, LotteryJson.abi, signer)) as LotteryContract;
}

export async function getAuctionContract(signer?: Signer): Promise<AuctionContract> {
  return (await getContract(AUCTION_ADDRESS, AuctionJson.abi, signer)) as AuctionContract;
}

export async function getRewardsContract(signer?: Signer): Promise<RewardsContract> {
  return (await getContract(REWARDS_ADDRESS, RewardsJson.abi, signer)) as RewardsContract;
}

export async function getNFTContract(address: string, signer?: Signer): Promise<NftContract> {
  return (await getContract(address, SageNFTJson.abi, signer)) as NftContract;
}

export async function getERC20Contract(signer?: Signer): Promise<ERC20Contract> {
  return (await getContract(ASHTOKEN_ADDRESS, ERC20StandardJson.abi, signer)) as ERC20Contract;
}

export async function getNftFactoryContract(signer?: Signer): Promise<NftFactoryContract> {
  return (await getContract(NFTFACTORY_ADDRESS, NFTFactoryJson.abi, signer)) as NftFactoryContract;
}

export async function getMarketplaceContract(signer?: Signer): Promise<MarketplaceContract> {
  return (await getContract(MARKETPLACE_ADDRESS, MarketplaceJson.abi, signer)) as MarketplaceContract;
}

async function getContract(address: string, abi: any, signer?: Signer) {
  if (signer) {
    return new ethers.Contract(address, abi, signer);
  }
  return await ContractFactory.getInstance(address, abi);
}

export function extractErrorMessage(err: any): string {
  var error = err.error ? err.error : err;
  var rawMessage: any;
  if (error.code == -32603) {
    // RPC Error: Internal JSON-RPC error
    rawMessage = error.message;
  }
  if (!rawMessage) {
    rawMessage = err.message;
  }
  var key = 'execution reverted: ';
  if (rawMessage.includes(key)) {
    return rawMessage.substring(rawMessage.indexOf(key) + key.length);
  }
  return rawMessage;
}

export async function getBlockchainTimestamp(): Promise<number> {
  const provider = ethers.providers.getDefaultProvider(NETWORK_NAME);
  const currentBlock = await provider.getBlockNumber();
  const blockTimestamp = (await provider.getBlock(currentBlock)).timestamp;
  console.log(`getBlockchainTimestamp() :: ${new Date(blockTimestamp * 1000).toISOString()}`);
  return blockTimestamp;
}

export async function approveERC20Transfer(erc20Address: string, signer: Signer, amount: number) {
  const erc20Contract = new ethers.Contract(
    erc20Address,
    ERC20StandardJson.abi,
    signer
  ) as ERC20Contract;
  const wallet = await signer.getAddress();
  const allowance = await (erc20Contract as ERC20Contract).allowance(wallet, AUCTION_ADDRESS);
  console.log(
    `approveERC20Transfer() :: contract ${erc20Address} allowance for wallet ${wallet} is ${allowance}`
  );
  const amountBN = BigNumber.from(utils.parseEther(String(amount)));
  if (allowance.lt(amountBN)) {
    var tx = await erc20Contract.approve(AUCTION_ADDRESS, ethers.constants.MaxUint256);
    toast.promise(tx.wait(), {
      pending: 'Approval submitted to the blockchain, awaiting confirmation...',
      success: `Approved! Preparing bid...`,
      error: 'Failure! Unable to complete request.',
    });
    await tx.wait();
  }
}

/**
 * This function is called server-side so winner can't be spoofed
 */
export async function getUnclaimedAuctionWinner(auctionId: number): Promise<string> {
  console.log(`getUnclaimedAuctionWinner(${auctionId})`);
  const privateKey = process.env.DEV_WALLET_PK || '';
  const providerUrl = process.env.RPC_PROVIDER_URL || '';
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(AUCTION_ADDRESS, AuctionJson.abi, signer);
  const auctionState = await contract.getAuction(auctionId);
  if (auctionState.endTime > new Date().getTime() / 1000) {
    throw Error(`Auction ${auctionId} hasn't finished yet.`);
  }
  return auctionState.highestBidder;
}

/**
	ERC20, currently we use ASH
 */
export async function getAshTokenInfo() {
  const AshContract = await getERC20Contract();
  const decimals = await AshContract.decimals();
  return { decimals };
}

// export async function getLotteryCost({}) {
//   const { decimals } = await getAshTokenInfo();

//   // const costTokens = BigInt(lottery.costPerTicketTokens * 1000) * BigInt(10 ** 15);
//   // const costPoints = BigInt(lottery.costPerTicketPoints);
// }
