import Arweave from 'arweave';
import Transaction from 'arweave/node/lib/transaction';
import { computePrimes } from 'jwk-rsa-compute-primes';

const arweaveJwk = computePrimes(JSON.parse(process.env.ARWEAVE_JSON_JWK || ''));

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 120000,
});

export async function sendArweaveTransaction(
  filename: string,
  data: Uint8Array,
  contentType: string
): Promise<{ tx: Transaction; balance: string }> {
  const tx = await arweave.createTransaction({ data }, arweaveJwk);
  tx.addTag('Content-Type', contentType);
  await arweave.transactions.sign(tx, arweaveJwk);
  await arweave.transactions.post(tx);
  // const uploader = await arweave.transactions.getUploader(transaction);
  // while (!uploader.isComplete) {
  //   await uploader.uploadChunk();
  //   console.log(
  //     `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
  //   );
  // }
  console.log(`sendArweaveTransaction() :: ${filename} -> ${tx.id}`);
  const { balance } = await getArweaveBalance();
  return { tx, balance };
}

export async function getArweaveBalance(): Promise<{ address: string; balance: string }> {
  const address = await arweave.wallets.jwkToAddress(arweaveJwk);
  var balance = await arweave.wallets.getBalance(address);
  balance = arweave.ar.winstonToAr(balance);
  console.log(`getArweaveBalance(${address}) :: ${balance}`);
  return { address, balance };
}
