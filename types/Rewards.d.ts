/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface RewardsInterface extends ethers.utils.Interface {
  functions: {
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "MANAGE_POINTS_ROLE()": FunctionFragment;
    "availablePoints(address)": FunctionFragment;
    "burnUserPoints(address,uint256)": FunctionFragment;
    "claimPointsWithProof(address,uint256,bytes32[])": FunctionFragment;
    "getPointsUsedBatch(address[])": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "pointsMerkleRoot()": FunctionFragment;
    "refundPoints(address,uint256)": FunctionFragment;
    "removeReward(uint256)": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "rewardInfo(address)": FunctionFragment;
    "rewardTokenAddresses(uint256)": FunctionFragment;
    "setPointsMerkleRoot(bytes32)": FunctionFragment;
    "setRewardRate(address,uint16,uint256,uint256,uint256)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "totalPointsEarned(address)": FunctionFragment;
    "totalPointsUsed(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MANAGE_POINTS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "availablePoints",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "burnUserPoints",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claimPointsWithProof",
    values: [string, BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getPointsUsedBatch",
    values: [string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "pointsMerkleRoot",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "refundPoints",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeReward",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(functionFragment: "rewardInfo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "rewardTokenAddresses",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPointsMerkleRoot",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setRewardRate",
    values: [string, BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "totalPointsEarned",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalPointsUsed",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MANAGE_POINTS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "availablePoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "burnUserPoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimPointsWithProof",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPointsUsedBatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pointsMerkleRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "refundPoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rewardInfo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardTokenAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPointsMerkleRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRewardRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalPointsEarned",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalPointsUsed",
    data: BytesLike
  ): Result;

  events: {
    "PointsEarned(address,uint256)": EventFragment;
    "PointsUsed(address,uint256,uint256)": EventFragment;
    "RewardChanged(address,uint256,uint256,uint256)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PointsEarned"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PointsUsed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
}

export type PointsEarnedEvent = TypedEvent<
  [string, BigNumber] & { user: string; amount: BigNumber }
>;

export type PointsUsedEvent = TypedEvent<
  [string, BigNumber, BigNumber] & {
    user: string;
    amount: BigNumber;
    remaining: BigNumber;
  }
>;

export type RewardChangedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber] & {
    token: string;
    pointRewardPerDay: BigNumber;
    positionSize: BigNumber;
    positionSizeLimit: BigNumber;
  }
>;

export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string] & {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
>;

export type RoleGrantedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export type RoleRevokedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export class Rewards extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: RewardsInterface;

  functions: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    MANAGE_POINTS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    availablePoints(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    burnUserPoints(
      _account: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimPointsWithProof(
      _address: string,
      _points: BigNumberish,
      _proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getPointsUsedBatch(
      addresses: string[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    pointsMerkleRoot(overrides?: CallOverrides): Promise<[string]>;

    refundPoints(
      _account: string,
      _points: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeReward(
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber, BigNumber, BigNumber] & {
        chainId: number;
        pointRewardPerDay: BigNumber;
        positionSize: BigNumber;
        positionSizeLimit: BigNumber;
      }
    >;

    rewardTokenAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setPointsMerkleRoot(
      _root: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRewardRate(
      _token: string,
      _chainId: BigNumberish,
      _pointRewardPerDay: BigNumberish,
      _positionSize: BigNumberish,
      _positionSizeLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    totalPointsEarned(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    totalPointsUsed(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  MANAGE_POINTS_ROLE(overrides?: CallOverrides): Promise<string>;

  availablePoints(user: string, overrides?: CallOverrides): Promise<BigNumber>;

  burnUserPoints(
    _account: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimPointsWithProof(
    _address: string,
    _points: BigNumberish,
    _proof: BytesLike[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getPointsUsedBatch(
    addresses: string[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  grantRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  pointsMerkleRoot(overrides?: CallOverrides): Promise<string>;

  refundPoints(
    _account: string,
    _points: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeReward(
    _index: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [number, BigNumber, BigNumber, BigNumber] & {
      chainId: number;
      pointRewardPerDay: BigNumber;
      positionSize: BigNumber;
      positionSizeLimit: BigNumber;
    }
  >;

  rewardTokenAddresses(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  setPointsMerkleRoot(
    _root: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRewardRate(
    _token: string,
    _chainId: BigNumberish,
    _pointRewardPerDay: BigNumberish,
    _positionSize: BigNumberish,
    _positionSizeLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  totalPointsEarned(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  totalPointsUsed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    MANAGE_POINTS_ROLE(overrides?: CallOverrides): Promise<string>;

    availablePoints(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burnUserPoints(
      _account: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimPointsWithProof(
      _address: string,
      _points: BigNumberish,
      _proof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPointsUsedBatch(
      addresses: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    pointsMerkleRoot(overrides?: CallOverrides): Promise<string>;

    refundPoints(
      _account: string,
      _points: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    removeReward(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    rewardInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber, BigNumber, BigNumber] & {
        chainId: number;
        pointRewardPerDay: BigNumber;
        positionSize: BigNumber;
        positionSizeLimit: BigNumber;
      }
    >;

    rewardTokenAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    setPointsMerkleRoot(
      _root: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setRewardRate(
      _token: string,
      _chainId: BigNumberish,
      _pointRewardPerDay: BigNumberish,
      _positionSize: BigNumberish,
      _positionSizeLimit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    totalPointsEarned(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalPointsUsed(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "PointsEarned(address,uint256)"(
      user?: string | null,
      amount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { user: string; amount: BigNumber }
    >;

    PointsEarned(
      user?: string | null,
      amount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { user: string; amount: BigNumber }
    >;

    "PointsUsed(address,uint256,uint256)"(
      user?: string | null,
      amount?: null,
      remaining?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { user: string; amount: BigNumber; remaining: BigNumber }
    >;

    PointsUsed(
      user?: string | null,
      amount?: null,
      remaining?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { user: string; amount: BigNumber; remaining: BigNumber }
    >;

    "RewardChanged(address,uint256,uint256,uint256)"(
      token?: string | null,
      pointRewardPerDay?: null,
      positionSize?: null,
      positionSizeLimit?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber],
      {
        token: string;
        pointRewardPerDay: BigNumber;
        positionSize: BigNumber;
        positionSizeLimit: BigNumber;
      }
    >;

    RewardChanged(
      token?: string | null,
      pointRewardPerDay?: null,
      positionSize?: null,
      positionSizeLimit?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber],
      {
        token: string;
        pointRewardPerDay: BigNumber;
        positionSize: BigNumber;
        positionSizeLimit: BigNumber;
      }
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    RoleAdminChanged(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    "RoleGranted(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleGranted(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    "RoleRevoked(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleRevoked(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;
  };

  estimateGas: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    MANAGE_POINTS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    availablePoints(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burnUserPoints(
      _account: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimPointsWithProof(
      _address: string,
      _points: BigNumberish,
      _proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getPointsUsedBatch(
      addresses: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pointsMerkleRoot(overrides?: CallOverrides): Promise<BigNumber>;

    refundPoints(
      _account: string,
      _points: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeReward(
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardTokenAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setPointsMerkleRoot(
      _root: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRewardRate(
      _token: string,
      _chainId: BigNumberish,
      _pointRewardPerDay: BigNumberish,
      _positionSize: BigNumberish,
      _positionSizeLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalPointsEarned(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalPointsUsed(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    MANAGE_POINTS_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    availablePoints(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burnUserPoints(
      _account: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimPointsWithProof(
      _address: string,
      _points: BigNumberish,
      _proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getPointsUsedBatch(
      addresses: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pointsMerkleRoot(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    refundPoints(
      _account: string,
      _points: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeReward(
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardTokenAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setPointsMerkleRoot(
      _root: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRewardRate(
      _token: string,
      _chainId: BigNumberish,
      _pointRewardPerDay: BigNumberish,
      _positionSize: BigNumberish,
      _positionSizeLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalPointsEarned(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalPointsUsed(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
