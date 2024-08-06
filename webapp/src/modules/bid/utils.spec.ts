import { BigNumber } from 'eth-connect'
import { ethers } from 'ethers'
import { ChainId, Network, TradeAssetType } from '@dcl/schemas'
import { ContractName, getContract } from 'decentraland-transactions'
import { Asset } from '../asset/types'
import { NFT } from '../nft/types'
import { createBidTrade } from './utils'

jest.mock('../../utils/trades', () => {
  const module = jest.requireActual('../../utils/trades')
  return {
    ...module,
    getTradeSignature: jest.fn().mockResolvedValue('0xsignature'),
    getOffChainMarketplaceContract: jest.fn().mockResolvedValue({
      contractSignatureIndex: jest.fn().mockResolvedValue(new BigNumber(1)),
      signerSignatureIndex: jest.fn().mockResolvedValue(new BigNumber(2))
    })
  } as unknown
})
jest.mock('decentraland-dapps/dist/lib/eth', () => {
  const module = jest.requireActual('decentraland-dapps/dist/lib/eth')
  return {
    ...module,
    getSigner: () => ({ getAddress: jest.fn().mockResolvedValue('0x123') })
  } as unknown
})

describe('when getting the trade object for a bid', () => {
  let asset: Asset
  let amount: number
  let expiresAt: number
  let fingerprint: string

  beforeEach(() => {
    amount = 1
    expiresAt = 1
  })

  describe('when the asset is an item', () => {
    beforeEach(() => {
      asset = { chainId: ChainId.ETHEREUM_SEPOLIA, network: Network.ETHEREUM, itemId: 'item-id', contractAddress: '0xcontract' } as Asset
    })

    it('should return the trade object', async () => {
      const manaContract = getContract(ContractName.MANAToken, asset.chainId)
      const trade = await createBidTrade(asset, amount, expiresAt, fingerprint)
      expect(trade).toEqual({
        signer: '0x123',
        signature: '0xsignature',
        network: asset.network,
        chainId: asset.chainId,
        type: 'bid',
        checks: {
          uses: 1,
          allowedRoot: '0x',
          contractSignatureIndex: 1,
          signerSignatureIndex: 2,
          effective: expect.any(Number),
          expiration: expiresAt,
          externalChecks: [],
          salt: expect.any(String)
        },
        sent: [
          {
            assetType: TradeAssetType.ERC20,
            contractAddress: manaContract.address,
            amount: ethers.utils.parseEther(amount.toString()).toString(),
            extra: ''
          }
        ],
        received: [
          {
            contractAddress: asset.contractAddress,
            itemId: asset.itemId,
            extra: '',
            assetType: TradeAssetType.COLLECTION_ITEM,
            beneficiary: '0x123'
          }
        ]
      })
    })
  })

  describe('when the asset is an nft', () => {
    beforeEach(() => {
      asset = { chainId: ChainId.ETHEREUM_SEPOLIA, network: Network.ETHEREUM, tokenId: 'token-id', contractAddress: '0xcontract' } as Asset
    })

    describe('and a fingerprint is provided', () => {
      beforeEach(() => {
        fingerprint = 'fingerprint'
      })

      it('should return the trade object with the fingerprint', async () => {
        const manaContract = getContract(ContractName.MANAToken, asset.chainId)
        const trade = await createBidTrade(asset, amount, expiresAt, fingerprint)
        expect(trade).toEqual({
          signer: '0x123',
          signature: '0xsignature',
          network: asset.network,
          chainId: asset.chainId,
          type: 'bid',
          checks: {
            uses: 1,
            allowedRoot: '0x',
            contractSignatureIndex: 1,
            signerSignatureIndex: 2,
            effective: expect.any(Number),
            expiration: expiresAt,
            externalChecks: [],
            salt: expect.any(String)
          },
          sent: [
            {
              assetType: TradeAssetType.ERC20,
              contractAddress: manaContract.address,
              amount: ethers.utils.parseEther(amount.toString()).toString(),
              extra: ''
            }
          ],
          received: [
            {
              contractAddress: asset.contractAddress,
              tokenId: (asset as NFT).tokenId,
              extra: fingerprint,
              assetType: TradeAssetType.ERC721,
              beneficiary: '0x123'
            }
          ]
        })
      })
    })

    describe('and a fingerprint is not provided', () => {
      beforeEach(() => {
        fingerprint = ''
      })

      it('should return the trade object without the fingerprint', async () => {
        const manaContract = getContract(ContractName.MANAToken, asset.chainId)
        const trade = await createBidTrade(asset, amount, expiresAt, fingerprint)
        expect(trade).toEqual({
          signer: '0x123',
          signature: '0xsignature',
          network: asset.network,
          chainId: asset.chainId,
          type: 'bid',
          checks: {
            uses: 1,
            allowedRoot: '0x',
            contractSignatureIndex: 1,
            signerSignatureIndex: 2,
            effective: expect.any(Number),
            expiration: expiresAt,
            externalChecks: [],
            salt: expect.any(String)
          },
          sent: [
            {
              assetType: TradeAssetType.ERC20,
              contractAddress: manaContract.address,
              amount: ethers.utils.parseEther(amount.toString()).toString(),
              extra: ''
            }
          ],
          received: [
            {
              contractAddress: asset.contractAddress,
              tokenId: (asset as NFT).tokenId,
              extra: '',
              assetType: TradeAssetType.ERC721,
              beneficiary: '0x123'
            }
          ]
        })
      })
    })
  })
})
