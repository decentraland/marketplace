import { BigNumber, TypedDataDomain, TypedDataField, ethers } from 'ethers'
import { ChainId, OnChainTrade, OnChainTradeAsset, Trade, TradeAsset, TradeAssetType, TradeCreation } from '@dcl/schemas'
import { getNetworkProvider, getSigner } from 'decentraland-dapps/dist/lib/eth'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { ContractData, ContractName, getContract, getContractName } from 'decentraland-transactions'
import { API_SIGNER } from '../lib/api'
import { fromMillisecondsToSeconds } from '../lib/time'
import { MARKETPLACE_SERVER_URL } from '../modules/vendor/decentraland/marketplace/api'

export const OFFCHAIN_MARKETPLACE_TYPES: Record<string, TypedDataField[]> = {
  Trade: [
    { name: 'checks', type: 'Checks' },
    { name: 'sent', type: 'AssetWithoutBeneficiary[]' },
    { name: 'received', type: 'Asset[]' }
  ],
  Asset: [
    { name: 'assetType', type: 'uint256' },
    { name: 'contractAddress', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'extra', type: 'bytes' },
    { name: 'beneficiary', type: 'address' }
  ],
  AssetWithoutBeneficiary: [
    { name: 'assetType', type: 'uint256' },
    { name: 'contractAddress', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'extra', type: 'bytes' }
  ],
  Checks: [
    { name: 'uses', type: 'uint256' },
    { name: 'expiration', type: 'uint256' },
    { name: 'effective', type: 'uint256' },
    { name: 'salt', type: 'bytes32' },
    { name: 'contractSignatureIndex', type: 'uint256' },
    { name: 'signerSignatureIndex', type: 'uint256' },
    { name: 'allowedRoot', type: 'bytes32' },
    { name: 'externalChecks', type: 'ExternalCheck[]' }
  ],
  ExternalCheck: [
    { name: 'contractAddress', type: 'address' },
    { name: 'selector', type: 'bytes4' },
    { name: 'value', type: 'bytes' },
    { name: 'required', type: 'bool' }
  ]
}

/**
 * Off-chain marketplace versions, newest first.
 *
 * The EIP-712 domain names its verifying contract, so the version a trade is signed against is part of
 * what the signer signed, and every approval the UI asks for has to name that same contract. V3 is
 * testnet-only for now, so mainnet has to keep using V2 rather than fail.
 */
const OFF_CHAIN_MARKETPLACE_CONTRACT_NAMES = [ContractName.OffChainMarketplaceV3, ContractName.OffChainMarketplaceV2]

/**
 * The same versions plus V1, for enumerating EXISTING grants rather than choosing where to sign. V1 never
 * receives a new listing, but a wallet that traded before V2 can still hold an allowance on it.
 */
const OFF_CHAIN_MARKETPLACE_SETTINGS_CONTRACT_NAMES = [
  ContractName.OffChainMarketplaceV3,
  ContractName.OffChainMarketplaceV2,
  ContractName.OffChainMarketplace
]

/**
 * Every off-chain marketplace version deployed on a chain, newest first.
 *
 * Distinct from {@link getLatestOffChainMarketplaceContract}, which answers "where do NEW listings go".
 * This answers "where might a user already have granted an allowance" — a grant made against an older
 * version stays live on chain after a newer one ships, so the Settings page has to be able to show and
 * revoke it. Guarded per candidate because `getContract` throws for a version a chain does not have.
 */
export function getDeployedOffChainMarketplaceContracts(chainId: ChainId): { contractName: ContractName; contract: ContractData }[] {
  return OFF_CHAIN_MARKETPLACE_SETTINGS_CONTRACT_NAMES.reduce<{ contractName: ContractName; contract: ContractData }[]>(
    (deployed, contractName) => {
      try {
        deployed.push({ contractName, contract: getContract(contractName, chainId) })
      } catch (_error) {
        // Not deployed on this chain.
      }
      return deployed
    },
    []
  )
}

/**
 * The newest off-chain marketplace deployed on a chain.
 *
 * `getContract` THROWS for a version that is not deployed on the given chain rather than returning a
 * falsy value, which is why each candidate is tried in turn.
 */
export function getLatestOffChainMarketplaceContract(chainId: ChainId): ContractData {
  for (const contractName of OFF_CHAIN_MARKETPLACE_CONTRACT_NAMES) {
    try {
      return getContract(contractName, chainId)
    } catch (_error) {
      continue
    }
  }
  throw new Error(`No off-chain marketplace contract exists on chain ${chainId}`)
}

export async function getOffChainMarketplaceContract(chainId: ChainId) {
  const provider = await getNetworkProvider(chainId)
  if (!provider) {
    throw new Error('Could not get connected provider')
  }
  const { address, abi } = getLatestOffChainMarketplaceContract(chainId)
  const instance = new ethers.Contract(address, abi, new ethers.providers.Web3Provider(provider))
  return instance
}

export function getValueForTradeAsset(asset: TradeAsset): string {
  switch (asset.assetType) {
    case TradeAssetType.ERC721:
      return asset.tokenId
    case TradeAssetType.COLLECTION_ITEM:
      return asset.itemId
    case TradeAssetType.ERC20:
      return asset.amount
    case TradeAssetType.USD_PEGGED_MANA:
      // The amount VERBATIM. It is denominated in USD wei rather than MANA wei, but converting it is the
      // contract's job at settlement, not this function's: what goes in here has to reproduce the value the
      // SELLER signed, or the rebuilt trade hashes differently and `accept()` is rejected on chain.
      return asset.amount
    default: {
      // Compile-time exhaustiveness: a new member of the `TradeAsset` union without a case above becomes a
      // type error here, instead of a silent '' that only surfaces as a rejected signature on chain (which
      // is how the USD_PEGGED_MANA case came to be missing). Runtime behaviour is unchanged on purpose —
      // this also receives API data, so a value outside the union must degrade rather than throw.
      const unhandled: never = asset
      console.error('Invalid asset type:', unhandled)
      return ''
    }
  }
}

export function generateTradeValues(trade: Omit<TradeCreation, 'signature'>) {
  return {
    checks: {
      uses: trade.checks.uses,
      expiration: fromMillisecondsToSeconds(trade.checks.expiration),
      effective: fromMillisecondsToSeconds(trade.checks.effective),
      salt: ethers.utils.hexZeroPad(trade.checks.salt, 32),
      contractSignatureIndex: trade.checks.contractSignatureIndex,
      signerSignatureIndex: trade.checks.signerSignatureIndex,
      allowedRoot: ethers.utils.hexZeroPad(trade.checks.allowedRoot, 32),
      externalChecks: trade.checks.externalChecks?.map(externalCheck => ({
        contractAddress: externalCheck.contractAddress,
        selector: externalCheck.selector,
        // '0x' is the default value for value bytes (0 bytes)
        value: externalCheck.value ? externalCheck.value : '0x',
        required: externalCheck.required
      }))
    },
    sent: trade.sent.map(asset => ({
      assetType: asset.assetType,
      contractAddress: asset.contractAddress,
      value: getValueForTradeAsset(asset),
      // '0x' is the default value for extra bytes (0 bytes)
      extra: asset.extra ? asset.extra : '0x'
    })),
    received: trade.received.map(asset => ({
      assetType: asset.assetType,
      contractAddress: asset.contractAddress,
      value: getValueForTradeAsset(asset),
      // '0x' is the default value for extra bytes (0 bytes)
      extra: asset.extra ? asset.extra : '0x',
      beneficiary: asset.beneficiary
    }))
  }
}

export function getOnChainTrade(trade: Trade, sentBeneficiaryAddress: string): OnChainTrade {
  const tradeValues = generateTradeValues(trade)

  return {
    signer: trade.signer,
    signature: trade.signature,
    ...tradeValues,
    checks: {
      ...tradeValues.checks,
      allowedProof: []
    },
    // set the beneficiary of the sent assets to the address of the logged in user
    sent: tradeValues.sent.map<OnChainTradeAsset>(asset => ({
      ...asset,
      beneficiary: sentBeneficiaryAddress
    }))
  }
}

export async function getTradeSignature(trade: Omit<TradeCreation, 'signature'>) {
  const marketplaceContract: ContractData = getLatestOffChainMarketplaceContract(trade.chainId)

  const signer = (await getSigner()) as ethers.providers.JsonRpcSigner
  const SALT = ethers.utils.hexZeroPad(ethers.utils.hexlify(trade.chainId), 32)
  const domain: TypedDataDomain = {
    name: marketplaceContract.name,
    version: marketplaceContract.version,
    salt: SALT,
    verifyingContract: marketplaceContract.address
  }

  const signature = await signer._signTypedData(domain, OFFCHAIN_MARKETPLACE_TYPES, generateTradeValues(trade))
  return signature
}

export async function estimateTradeGas(
  tradeId: string,
  tradeContractAddress: string | undefined,
  chainId: ChainId,
  buyerAddress: string,
  provider: ethers.providers.Web3Provider
): Promise<BigNumber> {
  const trade = await new TradeService(API_SIGNER, MARKETPLACE_SERVER_URL, () => undefined).fetchTrade(tradeId)
  // Build the trade data
  const tradeToAccept = getOnChainTrade(trade, buyerAddress)
  // Estimate against the contract this trade actually settles on. The caller's address wins when given,
  // but the fallback is the trade's own `contract`, never a fixed version: estimating a V2 or V3 trade
  // against V1 measures a call that would revert, and `accept` reverting is exactly what a buyer needs the
  // estimate to warn them about. Fail closed if neither is available rather than guess a version.
  const settlementAddress = tradeContractAddress ?? trade.contract
  if (!settlementAddress) {
    throw new Error(`Trade ${tradeId} has no settlement contract to estimate against`)
  }
  const contract = getContract(getContractName(settlementAddress), chainId)
  const c = new ethers.Contract(contract.address, contract.abi, provider)
  return c.estimateGas.accept([tradeToAccept], { from: buyerAddress })
}
