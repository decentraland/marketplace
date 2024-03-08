import { ethers } from 'ethers'
import { ChainId, ListingStatus, Order, OrderFilters, OrderSortBy } from '@dcl/schemas'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import * as walletUtils from 'decentraland-dapps/dist/modules/wallet/utils'
import * as orderAPI from './order/api'
import { NFT } from '../../nft/types'
import { OrderService } from './OrderService'

jest.mock('decentraland-dapps/dist/modules/wallet/utils')
jest.mock('./order/api')

const aTxHash = 'txHash'
const aBasicErrorMessage = 'error'

describe("Decentraland's OrderService", () => {
  let orderService: OrderService
  let nft: NFT

  beforeEach(() => {
    orderService = new OrderService()
    nft = {
      chainId: ChainId.MATIC_MUMBAI,
      contractAddress: '0x2323233423',
      tokenId: 'aTokenId'
    } as NFT
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when fetching orders by NFT', () => {
    const params: OrderFilters = {
      contractAddress: '0x2323233423',
      first: 6,
      skip: 0,
      itemId: '1',
      status: ListingStatus.OPEN
    }

    const sortBy = OrderSortBy.CHEAPEST

    describe('when the fetch fails', () => {
      beforeEach(() => {
        ;(orderAPI.orderAPI.fetchOrders as jest.Mock).mockRejectedValueOnce(aBasicErrorMessage)
      })

      it('should reject into an exception', () => {
        expect(orderService.fetchOrders(params, sortBy)).rejects.toBe(aBasicErrorMessage)
      })
    })

    describe('when the fetch is successful', () => {
      const orders = [{ id: 'anOrderId' }] as Order[]

      beforeEach(() => {
        ;(orderAPI.orderAPI.fetchOrders as jest.Mock).mockResolvedValueOnce(orders)
      })

      it('should reject into an exception', () => {
        expect(orderService.fetchOrders(params, sortBy)).resolves.toEqual(orders)
      })
    })
  })

  describe('when executing an order', () => {
    let order: Order
    let fingerprint: string | undefined

    beforeEach(() => {
      order = {
        price: '10000000000000000000',
        marketplaceAddress: '0x2a09a000224f5dbe0E17214cA95CDe506DA7CB74',
        chainId: ChainId.MATIC_MUMBAI
      } as Order
    })

    describe("when the market's contract doesn't exist for the order's chainId", () => {
      it('should reject into an exception', () => {
        order.chainId = 234234 as ChainId
        return expect(orderService.execute(null, nft, order, fingerprint)).rejects.toEqual(
          new Error(`Could not get a valid contract for Marketplace using chain ${order.chainId}`)
        )
      })
    })

    describe("when there's a fingerprint available", () => {
      beforeEach(() => {
        fingerprint = 'aFingerprint'
      })

      describe('when the transaction fails', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockRejectedValueOnce(aBasicErrorMessage)
        })

        it('should reject into an exception', () => {
          return expect(orderService.execute(null, nft, order, fingerprint)).rejects.toEqual(aBasicErrorMessage)
        })
      })

      describe('when the transaction is successful', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockResolvedValueOnce(aTxHash)
        })

        it("should have called send transaction with the marketplace's contract using the order's chain id", async () => {
          await orderService.execute(null, nft, order, fingerprint)
          expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

          const firstParameter = (walletUtils.sendTransaction as jest.Mock).mock.calls[0][0] as ContractData
          expect(firstParameter.chainId).toBe(order.chainId)
          expect(firstParameter.name).toBe('Decentraland Marketplace')
        })

        it("should have called send transaction with the contract's createOrder order operation", async () => {
          await orderService.execute(null, nft, order, fingerprint)
          expect(walletUtils.sendTransaction).toHaveBeenCalledWith(
            getContract(ContractName.Marketplace, order.chainId),
            'safeExecuteOrder',
            nft.contractAddress,
            nft.tokenId,
            order.price,
            fingerprint
          )
        })

        it('should have returned the transaction hash', () => {
          return expect(orderService.execute(null, nft, order, fingerprint)).resolves.toBe(aTxHash)
        })
      })
    })

    describe("when there's no fingerprint available", () => {
      beforeEach(() => {
        fingerprint = undefined
      })

      describe('when the transaction fails', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockRejectedValueOnce(aBasicErrorMessage)
        })

        it('should reject into an exception', () => {
          return expect(orderService.execute(null, nft, order, fingerprint)).rejects.toEqual(aBasicErrorMessage)
        })
      })

      describe('when the transaction is successful', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockResolvedValueOnce(aTxHash)
        })

        it("should have called send transaction with the marketplace's contract using the order's chain id", async () => {
          await orderService.execute(null, nft, order, fingerprint)
          expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

          const firstParameter = (walletUtils.sendTransaction as jest.Mock).mock.calls[0][0] as ContractData
          expect(firstParameter.chainId).toBe(order.chainId)
          expect(firstParameter.name).toBe('Decentraland Marketplace')
        })

        it("should have called send transaction with the contract's createOrder order operation", async () => {
          await orderService.execute(null, nft, order, fingerprint)
          expect(walletUtils.sendTransaction).toHaveBeenCalledWith(
            getContract(ContractName.Marketplace, order.chainId),
            'executeOrder',
            nft.contractAddress,
            nft.tokenId,
            order.price
          )
        })

        it('should have returned the transaction hash', () => {
          return expect(orderService.execute(null, nft, order, fingerprint)).resolves.toBe(aTxHash)
        })
      })
    })
  })

  describe('when creating an order', () => {
    const priceInEther = 1
    const priceInWei = ethers.utils.parseEther(priceInEther.toString())
    const expiresAt = 123023432

    describe("when the market's contract doesn't exist for the NFT's chainId", () => {
      it('should reject into an exception', () => {
        nft.chainId = 234234 as ChainId
        return expect(orderService.create(null, nft, priceInEther, expiresAt)).rejects.toEqual(
          new Error(`Could not get a valid contract for MarketplaceV2 using chain ${nft.chainId}`)
        )
      })
    })

    describe('when the transaction fails', () => {
      beforeEach(() => {
        ;(walletUtils.sendTransaction as jest.Mock).mockRejectedValueOnce(aBasicErrorMessage)
      })

      it('should reject into an exception', () => {
        return expect(orderService.create(null, nft, priceInEther, expiresAt)).rejects.toEqual(aBasicErrorMessage)
      })
    })

    describe('when the transaction is successful', () => {
      beforeEach(() => {
        ;(walletUtils.sendTransaction as jest.Mock).mockResolvedValueOnce(aTxHash)
      })

      it("should have called send transaction with the marketplace's contract using the nft's chain id", async () => {
        await orderService.create(null, nft, priceInEther, expiresAt)
        expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

        const firstParameter = (walletUtils.sendTransaction as jest.Mock).mock.calls[0][0] as ContractData
        expect(firstParameter.chainId).toBe(nft.chainId)
        expect(firstParameter.name).toBe('Decentraland Marketplace')
      })

      it("should have called send transaction with the contract's createOrder order operation", async () => {
        await orderService.create(null, nft, priceInEther, expiresAt)
        expect(walletUtils.sendTransaction).toHaveBeenCalledWith(
          getContract(ContractName.MarketplaceV2, nft.chainId),
          'createOrder',
          nft.contractAddress,
          nft.tokenId,
          priceInWei,
          Math.round(expiresAt / 1000)
        )
      })

      it('should have returned the transaction hash', () => {
        return expect(orderService.create(null, nft, priceInEther, expiresAt)).resolves.toBe(aTxHash)
      })
    })
  })

  describe('when cancelling the order', () => {
    let order: Order

    beforeEach(() => {
      order = {
        price: '10000000000000000000',
        contractAddress: '0x2323233423',
        tokenId: '1',
        marketplaceAddress: '0x2a09a000224f5dbe0E17214cA95CDe506DA7CB74',
        chainId: ChainId.MATIC_MUMBAI
      } as Order
    })

    describe("when the market's contract doesn't exist for the order's chainId", () => {
      it('should reject into an exception', () => {
        order.chainId = 234234 as ChainId
        return expect(orderService.cancel(null, order)).rejects.toEqual(
          new Error(`Could not get a valid contract for Marketplace using chain ${order.chainId}`)
        )
      })
    })

    describe('when the transaction fails', () => {
      beforeEach(() => {
        ;(walletUtils.sendTransaction as jest.Mock).mockRejectedValueOnce(aBasicErrorMessage)
      })

      it('should reject into an exception', () => {
        return expect(orderService.cancel(null, order)).rejects.toEqual(aBasicErrorMessage)
      })
    })

    describe('when the transaction is successful', () => {
      beforeEach(() => {
        ;(walletUtils.sendTransaction as jest.Mock).mockResolvedValueOnce(aTxHash)
      })

      it("should have called send transaction with the marketplace's contract using the order's chain id", async () => {
        await orderService.cancel(null, order)
        expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

        const firstParameter = (walletUtils.sendTransaction as jest.Mock).mock.calls[0][0] as ContractData
        expect(firstParameter.chainId).toBe(order.chainId)
        expect(firstParameter.name).toBe('Decentraland Marketplace')
      })

      it("should have called send transaction with the contract's cancel order operation", async () => {
        await orderService.cancel(null, order)
        expect(walletUtils.sendTransaction).toHaveBeenCalledWith(
          getContract(ContractName.Marketplace, order.chainId),
          'cancelOrder',
          order.contractAddress,
          order.tokenId
        )
      })

      it('should have returned the transaction hash', () => {
        return expect(orderService.cancel(null, order)).resolves.toBe(aTxHash)
      })
    })
  })

  describe('when asking if is possible to sell through the service', () => {
    it('should return true', () => {
      expect(orderService.canSell()).toBe(true)
    })
  })
})
