import { BigNumber, ContractTransaction, ethers, Signer } from 'ethers';

export async function registerLotterySale(
  lotteryId: number,
  amtTokens: BigNumber,
  amtPoints: number | null,
  tx: ContractTransaction,
  signer: Signer
) {
  await fetch(`/api/sales?action=RegisterSale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'LOTTERY',
      eventId: lotteryId,
      amountTokens: parseFloat(ethers.utils.formatUnits(amtTokens)),
      amountPoints: amtPoints,
      buyer: await signer.getAddress(),
      txHash: tx.hash,
      blockTimestamp: (await signer.provider.getBlock(tx.blockNumber)).timestamp,
    }),
  });
}

export async function registerAuctionSale(
  auctionId: number,
  amount: BigNumber,
  buyer: string,
  tx: ContractTransaction,
  signer: Signer
) {
  await fetch(`/api/sales?action=RegisterSale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'AUCTION',
      eventId: auctionId,
      amountTokens: parseFloat(ethers.utils.formatUnits(amount)),
      buyer,
      txHash: tx.hash,
      blockTimestamp: (await signer.provider.getBlock(tx.blockNumber)).timestamp,
    }),
  });
}

export async function registerMarketplaceSale(
  nftId: number,
  amount: number,
  buyer: string,
  tx: ContractTransaction,
  signer: Signer
) {
  await fetch(`/api/sales?action=RegisterSale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'MARKETPLACE',
      eventId: nftId,
      amountTokens: amount,
      buyer,
      txHash: tx.hash,
      blockTimestamp: (await signer.provider.getBlock(tx.blockNumber)).timestamp,
    }),
  });
}