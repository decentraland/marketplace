import BN from "bn.js";
import { Address } from "web3x-es/address";
import { EventLog, TransactionReceipt } from "web3x-es/formatters";
import { Contract, ContractOptions, TxCall, TxSend, EventSubscriptionFactory } from "web3x-es/contract";
import { Eth } from "web3x-es/eth";
import abi from "./ERC721Abi";
export type TransferEvent = {
    _from: Address;
    _to: Address;
    _tokenId: string;
};
export type ApprovalEvent = {
    _owner: Address;
    _approved: Address;
    _tokenId: string;
};
export type ApprovalForAllEvent = {
    _owner: Address;
    _operator: Address;
    _approved: boolean;
};
export interface TransferEventLog extends EventLog<TransferEvent, "Transfer"> {
}
export interface ApprovalEventLog extends EventLog<ApprovalEvent, "Approval"> {
}
export interface ApprovalForAllEventLog extends EventLog<ApprovalForAllEvent, "ApprovalForAll"> {
}
interface ERC721Events {
    Transfer: EventSubscriptionFactory<TransferEventLog>;
    Approval: EventSubscriptionFactory<ApprovalEventLog>;
    ApprovalForAll: EventSubscriptionFactory<ApprovalForAllEventLog>;
}
interface ERC721EventLogs {
    Transfer: TransferEventLog;
    Approval: ApprovalEventLog;
    ApprovalForAll: ApprovalForAllEventLog;
}
interface ERC721TxEventLogs {
    Transfer: TransferEventLog[];
    Approval: ApprovalEventLog[];
    ApprovalForAll: ApprovalForAllEventLog[];
}
export interface ERC721TransactionReceipt extends TransactionReceipt<ERC721TxEventLogs> {
}
interface ERC721Methods {
    supportsInterface(_interfaceId: string): TxCall<boolean>;
    name(): TxCall<string>;
    getApproved(_tokenId: number | string | BN): TxCall<Address>;
    approve(_to: Address, _tokenId: number | string | BN): TxSend<ERC721TransactionReceipt>;
    totalSupply(): TxCall<string>;
    InterfaceId_ERC165(): TxCall<string>;
    transferFrom(_from: Address, _to: Address, _tokenId: number | string | BN): TxSend<ERC721TransactionReceipt>;
    transfer(_to: Address, _tokenId: number | string | BN): TxSend<ERC721TransactionReceipt>;
    tokenOfOwnerByIndex(_owner: Address, _index: number | string | BN): TxCall<string>;
    safeTransferFrom(_from: Address, _to: Address, _tokenId: number | string | BN): TxSend<ERC721TransactionReceipt>;
    exists(_tokenId: number | string | BN): TxCall<boolean>;
    tokenByIndex(_index: number | string | BN): TxCall<string>;
    ownerOf(_tokenId: number | string | BN): TxCall<Address>;
    balanceOf(_owner: Address): TxCall<string>;
    symbol(): TxCall<string>;
    setApprovalForAll(_to: Address, _approved: boolean): TxSend<ERC721TransactionReceipt>;
    safeTransferFrom(_from: Address, _to: Address, _tokenId: number | string | BN, _data: string): TxSend<ERC721TransactionReceipt>;
    tokenURI(_tokenId: number | string | BN): TxCall<string>;
    isApprovedForAll(_owner: Address, _operator: Address): TxCall<boolean>;
    mintUniqueTokenTo(_to: Address, _tokenId: number | string | BN, _tokenURI: string): TxSend<ERC721TransactionReceipt>;
}
export interface ERC721Definition {
    methods: ERC721Methods;
    events: ERC721Events;
    eventLogs: ERC721EventLogs;
}
export class ERC721 extends Contract<ERC721Definition> {
    constructor(eth: Eth, address?: Address, options?: ContractOptions) {
        super(eth, abi, address, options);
    }
}
export var ERC721Abi = abi;
