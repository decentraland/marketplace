import { TypedDataDomain, TypedDataField, ethers } from 'ethers'
import { ChainId, OnChainTrade, OnChainTradeAsset, Trade, TradeAsset, TradeAssetType, TradeCreation } from '@dcl/schemas'
import { getNetworkProvider, getSigner } from 'decentraland-dapps/dist/lib/eth'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { fromMillisecondsToSeconds } from '../lib/time'

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

export async function getOffChainMarketplaceContract(chainId: ChainId) {
  const provider = await getNetworkProvider(chainId)
  if (!provider) {
    throw new Error('Could not get connected provider')
  }
  const { address, abi } = getContract(ContractName.OffChainMarketplace, chainId)
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
    default:
      console.error('Invalid asset type:', asset)
      return ''
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
        value: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(externalCheck.value)),
        required: externalCheck.required
      }))
    },
    sent: trade.sent.map(asset => ({
      assetType: asset.assetType,
      contractAddress: asset.contractAddress,
      value: getValueForTradeAsset(asset),
      extra: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(asset.extra))
    })),
    received: trade.received.map(asset => ({
      assetType: asset.assetType,
      contractAddress: asset.contractAddress,
      value: getValueForTradeAsset(asset),
      extra: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(asset.extra)),
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
  const marketplaceContract: ContractData = getContract(ContractName.OffChainMarketplace, trade.chainId)

  if (!marketplaceContract) {
    throw new Error(`The ${ContractName.OffChainMarketplace} contract doesn't exist on chain ${trade.chainId}`)
  }

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
