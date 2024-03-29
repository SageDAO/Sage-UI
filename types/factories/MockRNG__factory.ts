/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MockRNG, MockRNGInterface } from "../MockRNG";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_lotteryAddr",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "currentLotteryId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lotteryId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "randomness",
        type: "uint256",
      },
    ],
    name: "fulfillRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lotteryId",
        type: "uint256",
      },
    ],
    name: "getRandomNumber",
    outputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "randomResult",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60803461006757601f61052e38819003918201601f19168301916001600160401b0383118484101761006c5780849260209460405283398101031261006757516001600160a01b03811681036100675761005890610082565b60405161045890816100d68239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b60005460018060a01b031991338383161760005560018060a01b0391823391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e06000604051a31690600454161760045556fe608080604052600436101561001357600080fd5b6000803560e01c91826342619f66146100a457505080636be4097c1461009b578063715018a6146100925780638da5cb5b14610089578063b37217a414610080578063f2fde38b146100775763ff836f381461006f575b600080fd5b61006a610294565b5061006a6101f9565b5061006a61017c565b5061006a610152565b5061006a6100ec565b5061006a6100cd565b346100be57816003193601126100be576020906003548152f35b5080fd5b600091031261006a57565b503461006a57600036600319011261006a576020600654604051908152f35b503461006a5760008060031936011261014f5780546001600160a01b03811690610117338314610348565b6001600160a01b03191682556040519082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08284a3f35b80fd5b503461006a57600036600319011261006a576000546040516001600160a01b039091168152602090f35b503461006a57602036600319011261006a57600435336bffffffffffffffffffffffff60a01b600554161760055580600655604051906020820190815260208252604082019082821067ffffffffffffffff8311176101e357602092826040525190208152f35b634e487b7160e01b600052604160045260246000fd5b503461006a57602036600319011261006a576004356001600160a01b038082169081830361006a5761023090600054163314610348565b156102405761023e90610393565b005b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b503461006a57604036600319011261006a57600454602435906001600160a01b03169060405160208101906102df816102d1858560209181520190565b03601f1981018352826103f3565b51902090823b1561006a57604051632899068360e01b8152600480359082015260248101929092526044820152906000908290606490829084905af1801561033b575b61032857005b8061033561023e926103df565b806100c2565b610343610415565b610322565b1561034f57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b600080546001600160a01b039283166001600160a01b03198216811783556040519093909116917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3565b67ffffffffffffffff81116101e357604052565b90601f8019910116810190811067ffffffffffffffff8211176101e357604052565b506040513d6000823e3d90fdfea2646970667358221220f417d1fb36a56d09473915bf6a6d87ef9bb292ec9c1b0107e639a81dd8d9e8c664736f6c634300080e0033";

export class MockRNG__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _lotteryAddr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockRNG> {
    return super.deploy(_lotteryAddr, overrides || {}) as Promise<MockRNG>;
  }
  getDeployTransaction(
    _lotteryAddr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_lotteryAddr, overrides || {});
  }
  attach(address: string): MockRNG {
    return super.attach(address) as MockRNG;
  }
  connect(signer: Signer): MockRNG__factory {
    return super.connect(signer) as MockRNG__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockRNGInterface {
    return new utils.Interface(_abi) as MockRNGInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockRNG {
    return new Contract(address, _abi, signerOrProvider) as MockRNG;
  }
}
