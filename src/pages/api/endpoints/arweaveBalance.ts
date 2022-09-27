import Arweave from 'arweave';
import { computePrimes } from 'jwk-rsa-compute-primes';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (request: NextApiRequest, response: NextApiResponse) {
  const arweaveJwk = computePrimes(JSON.parse(process.env.ARWEAVE_JSON_JWK || ''));
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 120000,
  });
  const address = await arweave.wallets.jwkToAddress(arweaveJwk);
  var balance = await arweave.wallets.getBalance(address);
  balance = arweave.ar.winstonToAr(balance);
  response.json({ address, balance });
  response.end();
}
