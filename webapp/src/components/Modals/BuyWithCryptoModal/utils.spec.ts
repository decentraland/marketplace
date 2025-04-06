import { BigNumber, ethers } from 'ethers'
import { ChainId, Item, Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import type { Token } from 'decentraland-transactions/crossChain'
import { getContract, ContractName } from 'decentraland-transactions'
import { NFT } from '../../../modules/nft/types'
import { estimateTradeGas } from '../../../utils/trades'
import { NATIVE_TOKEN } from './hooks'
import { formatPrice, estimateMintNftGas, estimateBuyNftGas, getTokenBalance } from './utils'

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

  describe('getTokenBalance', () => {
    let chainId: ChainId
    let address: string
    let mockContract: ethers.Contract
    let mockSend: jest.SpyInstance
    let mockBalanceOf: jest.Mock

    beforeEach(() => {
      chainId = ChainId.ETHEREUM_MAINNET
      address = '0xUserAddress'
      // Mock send method for native token balance
      mockSend = jest.fn()
      // Mock balanceOf method for ERC20 tokens
      mockBalanceOf = jest.fn()
      // Mock Contract constructor and methods
      mockContract = {
        balanceOf: mockBalanceOf
      } as unknown as ethers.Contract
      // Spy on send method for native token balance
      mockSend = jest.spyOn(ethers.providers.Web3Provider.prototype, 'send')
      // Mock Contract constructor and methods
      jest.spyOn(ethers, 'Contract').mockImplementationOnce(() => mockContract)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('when getting the balance of a native token', () => {
      let nativeToken: Token
      let result: BigNumber
      const expectedBalance = '1000000000000000000' // 1 ETH

      beforeEach(async () => {
        nativeToken = {
          address: NATIVE_TOKEN,
          type: 'evm',
          symbol: 'ETH',
          decimals: 18
        } as Token

        // Mock the eth_getBalance response
        mockSend.mockResolvedValue(ethers.BigNumber.from(expectedBalance))

        result = await getTokenBalance(nativeToken, chainId, address)
      })

      it('should call provider.send with eth_getBalance and the right parameters', () => {
        expect(mockSend).toHaveBeenCalledWith('eth_getBalance', [address, 'latest'])
      })

      it('should return the balance as a BigNumber', () => {
        expect(result).toEqual(ethers.BigNumber.from(expectedBalance))
      })
    })

    describe('when getting the balance of an ERC20 token', () => {
      let erc20Token: Token
      let result: BigNumber
      const expectedBalance = '500000000000000000' // 0.5 tokens
      const tokenAddress = '0xTokenAddress'

      beforeEach(async () => {
        erc20Token = {
          address: tokenAddress,
          type: 'evm',
          symbol: 'MANA',
          decimals: 18
        } as Token

        // Mock the balanceOf response
        mockBalanceOf.mockResolvedValue(ethers.BigNumber.from(expectedBalance))

        result = await getTokenBalance(erc20Token, chainId, address)
      })

      it('should call contract.balanceOf with the user address', () => {
        expect(mockBalanceOf).toHaveBeenCalledWith(address)
      })

      it('should return the balance as a BigNumber', () => {
        expect(result).toEqual(ethers.BigNumber.from(expectedBalance))
      })
    })
  })
})
