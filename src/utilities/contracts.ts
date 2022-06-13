import { BigNumber, Contract, ethers, Signer, utils } from 'ethers';
import Rewards from '@/constants/abis/Rewards/Rewards.sol/Rewards.json';
import Lottery from '@/constants/abis/Lottery/Lottery.sol/Lottery.json';
import Auction from '@/constants/abis/Auction/Auction.sol/Auction.json';
import ERC20Standard from '@/constants/abis/ERC-20/ERC20Standard.json';
import {
  Lottery as LotteryContract,
  Auction as AuctionContract,
  Rewards as RewardsContract,
  ERC20Standard as ERC20Contract,
} from '@/types/contracts';
import { parameters } from '../constants/config';
import { toast } from 'react-toastify';

const { REWARDS_ADDRESS, LOTTERY_ADDRESS, AUCTION_ADDRESS, NETWORK_NAME } = parameters;

export type SignerOrProvider = Signer | Signer['provider'];

type AppContractNames = 'Lottery' | 'Auction' | 'Rewards';

type AppContractDetailsMap = {
  [key in AppContractNames]: ContractDetails;
};

const contractMap: AppContractDetailsMap = {
  Lottery: {
    address: LOTTERY_ADDRESS,
    abi: Lottery.abi,
  },
  Auction: {
    address: AUCTION_ADDRESS,
    abi: Auction.abi,
  },
  Rewards: {
    address: REWARDS_ADDRESS,
    abi: Rewards.abi,
  },
};

interface ContractDetails {
  address: string;
  abi: any;
}

var ContractFactory = (function () {
  var instances = new Map<string, Contract>();
  async function createInstance({ address, abi }: ContractDetails) {
    console.log(`Creating contract instance for address ${address}`);
    const contract = new ethers.Contract(address, abi, ethers.getDefaultProvider(NETWORK_NAME));
    instances.set(address, contract);
    return contract;
  }
  return {
    getInstance: async function ({ address, abi }: ContractDetails) {
      const existingContract = instances.get(address);
      if (!existingContract) {
        let contract = await createInstance({ address, abi });
        instances.set(address, contract);
        return contract;
      }
      return existingContract;
    },
  };
})();

export async function getLotteryContract(signer?: Signer): Promise<LotteryContract> {
  const { address, abi } = contractMap.Lottery;
  if (signer) {
    return new ethers.Contract(address, abi, signer) as LotteryContract;
  }
  return (await ContractFactory.getInstance({
    address,
    abi,
  })) as LotteryContract;
}

export async function getAuctionContract(signer?: Signer): Promise<AuctionContract> {
  const { address, abi } = contractMap.Auction;
  if (signer) {
    return new ethers.Contract(address, abi, signer) as AuctionContract;
  }
  return (await ContractFactory.getInstance({
    address,
    abi,
  })) as AuctionContract;
}

export async function getRewardsContract(signer?: Signer): Promise<RewardsContract> {
  const { address, abi } = contractMap.Rewards;
  if (signer) {
    return new ethers.Contract(address, abi, signer) as RewardsContract;
  }
  return (await ContractFactory.getInstance({
    address,
    abi,
  })) as RewardsContract;
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
    ERC20Standard.abi,
    signer
  ) as ERC20Contract;
  const wallet = await signer.getAddress();
  const allowance = await (erc20Contract as ERC20Contract).allowance(wallet, AUCTION_ADDRESS);
  console.log(
    `approveERC20Transfer() :: contract ${erc20Address} allowance for wallet ${wallet} is ${allowance}`
  );
  if (allowance.lt(BigNumber.from(utils.parseEther(String(amount))))) {
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
 * This function is called server-side, so web3Modal isn't available
 * if auction is finished and unclaimed, returns the winning wallet address;
 * if auction is already settled and claimed, throws an error
 */
export async function getUnclaimedAuctionWinner(auctionId: number): Promise<string> {
  console.log(`getUnclaimedAuctionWinner(${auctionId})`);
  const privateKey = process.env.DEV_WALLET_PK || '';
  const providerUrl = process.env.RPC_PROVIDER_URL || '';
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(AUCTION_ADDRESS, Auction.abi, signer);
  const auctionState = await contract.getAuction(auctionId);
  if (auctionState.settled || auctionState.endTime > new Date().getTime() / 1000) {
    throw Error(`Auction ${auctionId} is already settled or hasn't finished yet.`);
  }
  return auctionState.highestBidder;
}
