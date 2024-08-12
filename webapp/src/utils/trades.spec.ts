import { TypedDataDomain, ethers } from 'ethers'
import { ChainId, Network, TradeAssetType } from '@dcl/schemas'
import {
  CollectionItemTradeAsset,
  ERC20TradeAsset,
  ERC721TradeAsset,
  Trade,
  TradeAsset,
  TradeCreation,
  TradeType
} from '@dcl/schemas/dist/dapps/trade'
import * as ethUtils from 'decentraland-dapps/dist/lib/eth'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { fromMillisecondsToSeconds } from '../lib/time'
import { OFFCHAIN_MARKETPLACE_TYPES, getTradeSignature, getOnChainTrade, getValueForTradeAsset } from './trades'

jest.mock('decentraland-dapps/dist/lib/eth', () => {
  const module = jest.requireActual('decentraland-dapps/dist/lib/eth')
  return {
    ...module,
    getSigner: jest.fn(() => {
      const wallet = ethers.Wallet.createRandom()
      wallet.connect(ethers.providers.getDefaultProvider())
      return Promise.resolve(wallet)
    })
  } as unknown
})

describe('when getting the value for a trade asset', () => {
  let asset: TradeAsset

  describe('and the asset is an ERC20', () => {
    beforeEach(() => {
      asset = { assetType: TradeAssetType.ERC20, amount: '100' } as ERC20TradeAsset
    })

    it('should return the amount', () => {
      expect(getValueForTradeAsset(asset)).toBe((asset as ERC20TradeAsset).amount)
    })
  })

  describe('and the asset is an ERC721', () => {
    beforeEach(() => {
      asset = { assetType: TradeAssetType.ERC721, tokenId: 'token-id' } as ERC721TradeAsset
    })

    it('should return the token id', () => {
      expect(getValueForTradeAsset(asset)).toBe((asset as ERC721TradeAsset).tokenId)
    })
  })

  describe('and the asset is a COLLECTION ITEM', () => {
    beforeEach(() => {
      asset = { assetType: TradeAssetType.COLLECTION_ITEM, itemId: 'item-id' } as CollectionItemTradeAsset
    })

    it('should return the item id', () => {
      expect(getValueForTradeAsset(asset)).toBe((asset as CollectionItemTradeAsset).itemId)
    })
  })
})

describe('when getting the trade signature', () => {
  let trade: Omit<TradeCreation, 'signature'>

  describe('when the contract does not exist for that chainId', () => {
    beforeEach(() => {
      trade = {
        chainId: ChainId.ARBITRUM_MAINNET
      } as Omit<TradeCreation, 'signature'>
    })

    it('should throw an error', async () => {
      await expect(getTradeSignature(trade)).rejects.toThrowError(
        'Could not get a valid contract for OffChainMarketplace using chain 42161'
      )
    })
  })

  describe('when the contract exists for that chainId', () => {
    let offchainMarketplaceContract: ContractData
    let signerAddress: string
    let signer: ethers.Wallet
    let values: Record<string, any>
    let domain: TypedDataDomain

    beforeEach(async () => {
      signer = ethers.Wallet.createRandom().connect(ethers.providers.getDefaultProvider())
      jest.spyOn(ethUtils, 'getSigner').mockImplementation(() => Promise.resolve(signer))
      signerAddress = (await signer.getAddress()).toLowerCase()
      offchainMarketplaceContract = getContract(ContractName.OffChainMarketplace, ChainId.ETHEREUM_SEPOLIA)

      trade = {
        signer: signerAddress,
        type: TradeType.BID,
        network: Network.ETHEREUM,
        chainId: ChainId.ETHEREUM_SEPOLIA,
        checks: {
          expiration: Date.now() + 100000000000,
          effective: Date.now(),
          uses: 1,
          salt: '0x',
          allowedRoot: '0x',
          contractSignatureIndex: 0,
          externalChecks: [],
          signerSignatureIndex: 0
        },
        sent: [
          {
            assetType: TradeAssetType.ERC20,
            contractAddress: offchainMarketplaceContract.address,
            amount: '2',
            extra: ''
          }
        ],
        received: [
          {
            assetType: TradeAssetType.ERC721,
            contractAddress: offchainMarketplaceContract.address,
            tokenId: '1',
            extra: '',
            beneficiary: signerAddress
          }
        ]
      }

      const SALT = ethers.utils.hexZeroPad(ethers.utils.hexlify(trade.chainId), 32)
      offchainMarketplaceContract = getContract(ContractName.OffChainMarketplace, trade.chainId)
      domain = {
        name: offchainMarketplaceContract.name,
        version: offchainMarketplaceContract.version,
        salt: SALT,
        verifyingContract: offchainMarketplaceContract.address
      }

      values = {
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
    })

    it('should return the signature', async () => {
      expect(await getTradeSignature(trade)).toBe(await signer._signTypedData(domain, OFFCHAIN_MARKETPLACE_TYPES, values))
    })
  })
})

describe('when getting the trade to accept', () => {
  let trade: Trade
  let beneficiaryAddress: string

  beforeEach(() => {
    trade = {
      id: 'an-id',
      createdAt: Date.now(),
      signature: '123123123',
      signer: '0x123',
      type: TradeType.BID,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_SEPOLIA,
      checks: {
        expiration: Date.now() + 100000000000,
        effective: Date.now(),
        uses: 1,
        salt: '0x',
        allowedRoot: '0x',
        contractSignatureIndex: 0,
        externalChecks: [],
        signerSignatureIndex: 0
      },
      sent: [
        {
          assetType: TradeAssetType.ERC20,
          contractAddress: '0x123',
          amount: '2',
          extra: ''
        }
      ],
      received: [
        {
          assetType: TradeAssetType.ERC721,
          contractAddress: '0x123',
          tokenId: '1',
          extra: '',
          beneficiary: '0x123123'
        }
      ]
    }

    beneficiaryAddress = '0x123123'
  })

  it('should return the trade with the correct structure', () => {
    expect(getOnChainTrade(trade, beneficiaryAddress)).toEqual({
      signer: trade.signer,
      signature: trade.signature,
      checks: {
        expiration: fromMillisecondsToSeconds(trade.checks.expiration),
        effective: fromMillisecondsToSeconds(trade.checks.effective),
        uses: trade.checks.uses,
        salt: ethers.utils.hexZeroPad(trade.checks.salt, 32),
        allowedRoot: ethers.utils.hexZeroPad(trade.checks.allowedRoot, 32),
        allowedProof: [],
        contractSignatureIndex: trade.checks.contractSignatureIndex,
        signerSignatureIndex: trade.checks.signerSignatureIndex,
        externalChecks: trade.checks.externalChecks
      },
      sent: trade.sent.map(asset => ({
        assetType: asset.assetType,
        contractAddress: asset.contractAddress,
        value: getValueForTradeAsset(asset),
        extra: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(asset.extra)),
        beneficiary: beneficiaryAddress
      })),
      received: trade.received.map(asset => ({
        assetType: asset.assetType,
        contractAddress: asset.contractAddress,
        value: getValueForTradeAsset(asset),
        extra: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(asset.extra)),
        beneficiary: asset.beneficiary
      }))
    })
  })
})
