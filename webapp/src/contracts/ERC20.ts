import BN from "bn.js";
import { Address } from "web3x-es/address";
import { EventLog, TransactionReceipt } from "web3x-es/formatters";
import { Contract, ContractOptions, TxCall, TxSend, EventSubscriptionFactory } from "web3x-es/contract";
import { Eth } from "web3x-es/eth";
import abi from "./ERC20Abi";
export type MintEvent = {
    to: Address;
    amount: string;
};
export type MintFinishedEvent = {};
export type PauseEvent = {};
export type UnpauseEvent = {};
export type BurnEvent = {
    burner: Address;
    value: string;
};
export type ApprovalEvent = {
    owner: Address;
    spender: Address;
    value: string;
};
export type TransferEvent = {
    from: Address;
    to: Address;
    value: string;
};
export interface MintEventLog extends EventLog<MintEvent, "Mint"> {
}
export interface MintFinishedEventLog extends EventLog<MintFinishedEvent, "MintFinished"> {
}
export interface PauseEventLog extends EventLog<PauseEvent, "Pause"> {
}
export interface UnpauseEventLog extends EventLog<UnpauseEvent, "Unpause"> {
}
export interface BurnEventLog extends EventLog<BurnEvent, "Burn"> {
}
export interface ApprovalEventLog extends EventLog<ApprovalEvent, "Approval"> {
}
export interface TransferEventLog extends EventLog<TransferEvent, "Transfer"> {
}
interface ERC20Events {
    Mint: EventSubscriptionFactory<MintEventLog>;
    MintFinished: EventSubscriptionFactory<MintFinishedEventLog>;
    Pause: EventSubscriptionFactory<PauseEventLog>;
    Unpause: EventSubscriptionFactory<UnpauseEventLog>;
    Burn: EventSubscriptionFactory<BurnEventLog>;
    Approval: EventSubscriptionFactory<ApprovalEventLog>;
    Transfer: EventSubscriptionFactory<TransferEventLog>;
}
interface ERC20EventLogs {
    Mint: MintEventLog;
    MintFinished: MintFinishedEventLog;
    Pause: PauseEventLog;
    Unpause: UnpauseEventLog;
    Burn: BurnEventLog;
    Approval: ApprovalEventLog;
    Transfer: TransferEventLog;
}
interface ERC20TxEventLogs {
    Mint: MintEventLog[];
    MintFinished: MintFinishedEventLog[];
    Pause: PauseEventLog[];
    Unpause: UnpauseEventLog[];
    Burn: BurnEventLog[];
    Approval: ApprovalEventLog[];
    Transfer: TransferEventLog[];
}
export interface ERC20TransactionReceipt extends TransactionReceipt<ERC20TxEventLogs> {
}
interface ERC20Methods {
    mintingFinished(): TxCall<boolean>;
    name(): TxCall<string>;
    approve(_spender: Address, _value: number | string | BN): TxSend<ERC20TransactionReceipt>;
    totalSupply(): TxCall<string>;
    transferFrom(_from: Address, _to: Address, _value: number | string | BN): TxSend<ERC20TransactionReceipt>;
    decimals(): TxCall<string>;
    unpause(): TxSend<ERC20TransactionReceipt>;
    mint(_to: Address, _amount: number | string | BN): TxSend<ERC20TransactionReceipt>;
    burn(_value: number | string | BN): TxSend<ERC20TransactionReceipt>;
    paused(): TxCall<boolean>;
    balanceOf(_owner: Address): TxCall<string>;
    finishMinting(): TxSend<ERC20TransactionReceipt>;
    pause(): TxSend<ERC20TransactionReceipt>;
    owner(): TxCall<Address>;
    symbol(): TxCall<string>;
    transfer(_to: Address, _value: number | string | BN): TxSend<ERC20TransactionReceipt>;
    allowance(_owner: Address, _spender: Address): TxCall<string>;
    setBalance(to: Address, amount: number | string | BN): TxSend<ERC20TransactionReceipt>;
    transferOwnership(newOwner: Address): TxSend<ERC20TransactionReceipt>;
}
export interface ERC20Definition {
    methods: ERC20Methods;
    events: ERC20Events;
    eventLogs: ERC20EventLogs;
}
export class ERC20 extends Contract<ERC20Definition> {
    constructor(eth: Eth, address?: Address, options?: ContractOptions) {
        super(eth, abi, address, options);
    }
}
export var ERC20Abi = abi;
