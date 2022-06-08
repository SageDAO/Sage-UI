/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IBalanceOf, IBalanceOfInterface } from "../IBalanceOf";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IBalanceOf__factory {
  static readonly abi = _abi;
  static createInterface(): IBalanceOfInterface {
    return new utils.Interface(_abi) as IBalanceOfInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IBalanceOf {
    return new Contract(address, _abi, signerOrProvider) as IBalanceOf;
  }
}
