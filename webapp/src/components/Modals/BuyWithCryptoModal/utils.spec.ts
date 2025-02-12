import { BigNumber, ethers } from 'ethers'
import { ChainId, Item, Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import type { Token } from 'decentraland-transactions/crossChain'
import { getContract, ContractName } from 'decentraland-transactions'
import { NFT } from '../../../modules/nft/types'
import { estimateTradeGas } from '../../../utils/trades'
import { formatPrice, estimateMintNftGas, estimateBuyNftGas } from './utils'

jest.mock('../../../utils/trades', () => ({
  estimateTradeGas: jest.fn()
}))

let token: Token

describe('Utils', () => {
  describe('formatPrice with high value token', () => {
    beforeEach(() => {
      token = { usdPrice: 1000 } as Token
    })
    it('should render the right amount of decimals', () => {
      expect(formatPrice(1234.5678, token)).toBe(1234.5678)
      expect(formatPrice('1234.5678', token)).toBe(1234.5678)
      expect(formatPrice(1234.56789, token)).toBe(1234.5678)
      expect(formatPrice('1234.56789', token)).toBe(1234.5678)
      expect(formatPrice(0.0000001, token)).toBe(0.0000001) // show first relevant decimal even if it's too low
    })
  })

  describe('formatPrice with low value token', () => {
    beforeEach(() => {
      token = { usdPrice: 0.5 } as Token
    })
    it('should render the right amount of decimals', () => {
      expect(formatPrice(0.0001234, token)).toBe(0.00012)
      expect(formatPrice('0.0001234', token)).toBe(0.00012)
      expect(formatPrice(0.0001267, token)).toBe(0.00012)
      expect(formatPrice('0.0001267', token)).toBe(0.00012)
      expect(formatPrice(0.0000001, token)).toBe(0.0000001) // show first relevant decimal even if it's too low
    })
  })

  describe('when estimating minting gas for an asset', () => {
    let selectedChain: ChainId
    let wallet: Wallet
    let asset: Item

    beforeEach(() => {
      selectedChain = ChainId.ETHEREUM_MAINNET
      wallet = { address: '0x123' } as Wallet
      asset = {
        chainId: ChainId.ETHEREUM_MAINNET,
        contractAddress: '0x456',
        itemId: '789',
        price: '1000000000000000000',
        tradeId: 'trade-123'
      } as Item
      ;(estimateTradeGas as jest.Mock).mockReset()
    })

    describe('when the asset has a tradeId', () => {
      let result: BigNumber

      beforeEach(async () => {
        ;(estimateTradeGas as jest.Mock).mockResolvedValue(ethers.BigNumber.from('100000'))
        result = await estimateMintNftGas(selectedChain, wallet, asset)
      })

      it('should call estimateTradeGas with the correct parameters', () => {
        expect(estimateTradeGas).toHaveBeenCalledWith('trade-123', selectedChain, wallet.address, expect.any(ethers.providers.Web3Provider))
      })

      it('should return the estimated gas from estimateTradeGas', () => {
        expect(result).toEqual(ethers.BigNumber.from('100000'))
      })
    })
  })

  describe('when estimating gas for a buy order', () => {
    let selectedChain: ChainId
    let wallet: Wallet
    let asset: NFT
    let order: Order

    beforeEach(() => {
      selectedChain = ChainId.ETHEREUM_MAINNET
      wallet = { address: '0x123' } as Wallet
      asset = {
        chainId: ChainId.ETHEREUM_MAINNET,
        contractAddress: '0x456',
        tokenId: '789'
      } as NFT
      order = {
        chainId: ChainId.ETHEREUM_MAINNET,
        marketplaceAddress: getContract(ContractName.Marketplace, ChainId.ETHEREUM_MAINNET).address,
        price: '1000000000000000000',
        tradeId: 'trade-123'
      } as Order
      ;(estimateTradeGas as jest.Mock).mockReset()
    })

    describe('when order has a trade ID', () => {
      let result: BigNumber

      beforeEach(async () => {
        ;(estimateTradeGas as jest.Mock).mockResolvedValue(ethers.BigNumber.from('100000'))
        result = await estimateBuyNftGas(selectedChain, wallet, asset, order)
      })

      it('should call estimateTradeGas with the correct parameters', () => {
        expect(estimateTradeGas).toHaveBeenCalledWith('trade-123', order.chainId, wallet.address, expect.any(ethers.providers.Web3Provider))
      })

      it('should return the estimated gas from estimateTradeGas', () => {
        expect(result).toEqual(ethers.BigNumber.from('100000'))
      })
    })
  })
})
