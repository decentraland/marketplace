import BN from "bn.js";
import { Address } from "web3x-es/address";
import { EventLog, TransactionReceipt } from "web3x-es/formatters";
import { Contract, ContractOptions, TxCall, TxSend, EventSubscriptionFactory } from "web3x-es/contract";
import { Eth } from "web3x-es/eth";
import abi from "./CollectionStoreAbi";
export type BoughtEvent = {
    _itemsToBuy: {
        collection: Address;
        ids: string[];
        prices: string[];
        beneficiaries: Address[];
    }[];
};
export type MetaTransactionExecutedEvent = {
    userAddress: Address;
    relayerAddress: Address;
    functionSignature: string;
};
export type OwnershipTransferredEvent = {
    previousOwner: Address;
    newOwner: Address;
};
export type SetFeeEvent = {
    _oldFee: string;
    _newFee: string;
};
export type SetFeeOwnerEvent = {
    _oldFeeOwner: Address;
    _newFeeOwner: Address;
};
export interface BoughtEventLog extends EventLog<BoughtEvent, "Bought"> {
}
export interface MetaTransactionExecutedEventLog extends EventLog<MetaTransactionExecutedEvent, "MetaTransactionExecuted"> {
}
export interface OwnershipTransferredEventLog extends EventLog<OwnershipTransferredEvent, "OwnershipTransferred"> {
}
export interface SetFeeEventLog extends EventLog<SetFeeEvent, "SetFee"> {
}
export interface SetFeeOwnerEventLog extends EventLog<SetFeeOwnerEvent, "SetFeeOwner"> {
}
interface CollectionStoreEvents {
    Bought: EventSubscriptionFactory<BoughtEventLog>;
    MetaTransactionExecuted: EventSubscriptionFactory<MetaTransactionExecutedEventLog>;
    OwnershipTransferred: EventSubscriptionFactory<OwnershipTransferredEventLog>;
    SetFee: EventSubscriptionFactory<SetFeeEventLog>;
    SetFeeOwner: EventSubscriptionFactory<SetFeeOwnerEventLog>;
}
interface CollectionStoreEventLogs {
    Bought: BoughtEventLog;
    MetaTransactionExecuted: MetaTransactionExecutedEventLog;
    OwnershipTransferred: OwnershipTransferredEventLog;
    SetFee: SetFeeEventLog;
    SetFeeOwner: SetFeeOwnerEventLog;
}
interface CollectionStoreTxEventLogs {
    Bought: BoughtEventLog[];
    MetaTransactionExecuted: MetaTransactionExecutedEventLog[];
    OwnershipTransferred: OwnershipTransferredEventLog[];
    SetFee: SetFeeEventLog[];
    SetFeeOwner: SetFeeOwnerEventLog[];
}
export interface CollectionStoreTransactionReceipt extends TransactionReceipt<CollectionStoreTxEventLogs> {
}
interface CollectionStoreMethods {
    BASE_FEE(): TxCall<string>;
    acceptedToken(): TxCall<Address>;
    buy(_itemsToBuy: {
        collection: Address;
        ids: (number | string | BN)[];
        prices: (number | string | BN)[];
        beneficiaries: Address[];
    }[]): TxSend<CollectionStoreTransactionReceipt>;
    domainSeparator(): TxCall<string>;
    executeMetaTransaction(userAddress: Address, functionSignature: string, sigR: string, sigS: string, sigV: number | string | BN): TxSend<CollectionStoreTransactionReceipt>;
    fee(): TxCall<string>;
    feeOwner(): TxCall<Address>;
    getChainId(): TxCall<string>;
    getItemBuyData(_collection: Address, _itemId: number | string | BN): TxCall<{
        0: string;
        1: Address;
    }>;
    getNonce(user: Address): TxCall<string>;
    owner(): TxCall<Address>;
    renounceOwnership(): TxSend<CollectionStoreTransactionReceipt>;
    setFee(_newFee: number | string | BN): TxSend<CollectionStoreTransactionReceipt>;
    setFeeOwner(_newFeeOwner: Address): TxSend<CollectionStoreTransactionReceipt>;
    transferOwnership(newOwner: Address): TxSend<CollectionStoreTransactionReceipt>;
}
export interface CollectionStoreDefinition {
    methods: CollectionStoreMethods;
    events: CollectionStoreEvents;
    eventLogs: CollectionStoreEventLogs;
}
export class CollectionStore extends Contract<CollectionStoreDefinition> {
    constructor(eth: Eth, address?: Address, options?: ContractOptions) {
        super(eth, abi, address, options);
    }
}
export var CollectionStoreAbi = abi;
