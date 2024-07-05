import { TypedDataDomain, TypedDataField, ethers } from 'ethers'
import { ChainId, TradeAsset, TradeAssetType, TradeCreation } from '@dcl/schemas'
import { getConnectedProvider, getSigner } from 'decentraland-dapps/dist/lib/eth'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { fromMillisecondsToSeconds } from '../lib/time'

/* This helper had to be moved to a separate file so it can be mocked independently on tests */

export async function getOffChainMarketplaceContract(chainId: ChainId) {
  const provider = await getConnectedProvider()
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

  const types: Record<string, TypedDataField[]> = {
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
      { name: 'value', type: 'uint256' },
      { name: 'required', type: 'bool' }
    ]
  }

  const values = {
    checks: {
      uses: trade.checks.uses,
      expiration: fromMillisecondsToSeconds(trade.checks.expiration),
      effective: fromMillisecondsToSeconds(trade.checks.effective),
      salt: SALT,
      contractSignatureIndex: trade.checks.contractSignatureIndex,
      signerSignatureIndex: trade.checks.signerSignatureIndex,
      allowedRoot: ethers.utils.hexZeroPad(trade.checks.allowedRoot, 32),
      externalChecks: trade.checks.externalChecks?.map(externalCheck => ({
        contractAddress: externalCheck.contractAddress,
        selector: externalCheck.selector,
        value: externalCheck.value,
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

  const signature = await signer._signTypedData(domain, types, values)
  return signature
}
