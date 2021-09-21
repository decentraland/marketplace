import { OrderService } from './OrderService'
import { utils } from 'ethers'
import { ContractData } from 'decentraland-transactions'
import * as walletUtils from 'decentraland-dapps/dist/modules/wallet/utils'
import * as order from './order/api'
import { NFT } from '../../nft/types'
import { Order, OrderStatus } from '../../order/types'

jest.mock('decentraland-dapps/dist/modules/wallet/utils')
jest.mock('./order/api')

const aTxHash = 'txHash'
const aBasicErrorMessage = 'error'

describe("Decentraland's OrderService", () => {
  let orderService: OrderService
  let nft: NFT
  let marketplaceContract: {
    createOrder: jest.Mock
    cancelOrder: jest.Mock
    safeExecuteOrder: jest.Mock
    executeOrder: jest.Mock
  }

  beforeEach(() => {
    orderService = new OrderService()
    nft = {
      chainId: 1,
      contractAddress: '0x2323233423',
      tokenId: 'aTokenId'
    } as NFT
    marketplaceContract = {
      createOrder: jest.fn().mockReturnValue('createOrder'),
      cancelOrder: jest.fn().mockReturnValue('cancelOrder'),
      safeExecuteOrder: jest.fn().mockReturnValue('safeExecuteOrder'),
      executeOrder: jest.fn().mockReturnValue('executeOrder')
    }
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when fetching orders by NFT', () => {
    const status = OrderStatus.OPEN

    describe('when the fetch fails', () => {
      beforeEach(() => {
        ;(order.orderAPI.fetchByNFT as jest.Mock).mockRejectedValueOnce(
          aBasicErrorMessage
        )
      })

      it('should reject into an exception', () => {
        expect(orderService.fetchByNFT(nft, status)).rejects.toBe(
          aBasicErrorMessage
        )
      })
    })

    describe('when the fetch is successful', () => {
      const orders = [{ id: 'anOrderId' }] as Order[]

      beforeEach(() => {
        ;(order.orderAPI.fetchByNFT as jest.Mock).mockResolvedValueOnce(orders)
      })

      it('should reject into an exception', () => {
        expect(orderService.fetchByNFT(nft, status)).resolves.toEqual(orders)
      })
    })
  })

  describe('when executing an order', () => {
    let order: Order
    let fingerprint: string | undefined

    beforeEach(() => {
      order = { price: '10000000000000000000' } as Order
    })

    describe("when the market's contract doesn't exist for the NFT's chainId", () => {
      it('should reject into an exception', () => {
        nft.chainId = 234234
        return expect(
          orderService.execute(null, nft, order, fingerprint)
        ).rejects.toEqual(
          new Error(
            `Could not get a valid contract for Marketplace using chain ${nft.chainId}`
          )
        )
      })
    })

    describe("when there's a fingerprint available", () => {
      beforeEach(() => {
        fingerprint = 'aFingerprint'
      })

      describe('when the transaction fails', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockRejectedValueOnce(
            aBasicErrorMessage
          )
        })

        it('should reject into an exception', () => {
          return expect(
            orderService.execute(null, nft, order, fingerprint)
          ).rejects.toEqual(aBasicErrorMessage)
        })
      })

      describe('when the transaction is successful', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockResolvedValueOnce(
            aTxHash
          )
        })

        it("should have called send transaction with the marketplace's contract using the nft's chain id", async () => {
          await orderService.execute(null, nft, order, fingerprint)
          expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

          const firstParameter = (walletUtils.sendTransaction as jest.Mock).mock
            .calls[0][0] as ContractData
          expect(firstParameter.chainId).toBe(nft.chainId)
          expect(firstParameter.name).toBe('Decentraland Marketplace')
        })

        it("should have called send transaction with the contract's createOrder order operation", async () => {
          await orderService.execute(null, nft, order, fingerprint)
          expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

          const secondParameter = (walletUtils.sendTransaction as jest.Mock)
            .mock.calls[0][1]
          const parametrizedContractExecutionResult = secondParameter(
            marketplaceContract
          )
          expect(parametrizedContractExecutionResult).toBe('safeExecuteOrder')
          expect(marketplaceContract.safeExecuteOrder).toHaveBeenCalledWith(
            nft.contractAddress,
            nft.tokenId,
            order.price,
            fingerprint
          )
        })

        it('should have returned the transaction hash', () => {
          return expect(
            orderService.execute(null, nft, order, fingerprint)
          ).resolves.toBe(aTxHash)
        })
      })
    })

    describe("when there's no fingerprint available", () => {
      beforeEach(() => {
        fingerprint = undefined
      })

      describe('when the transaction fails', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockRejectedValueOnce(
            aBasicErrorMessage
          )
        })

        it('should reject into an exception', () => {
          return expect(
            orderService.execute(null, nft, order, fingerprint)
          ).rejects.toEqual(aBasicErrorMessage)
        })
      })

      describe('when the transaction is successful', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockResolvedValueOnce(
            aTxHash
          )
        })

        it("should have called send transaction with the marketplace's contract using the nft's chain id", async () => {
          await orderService.execute(null, nft, order, fingerprint)
          expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

          const firstParameter = (walletUtils.sendTransaction as jest.Mock).mock
            .calls[0][0] as ContractData
          expect(firstParameter.chainId).toBe(nft.chainId)
          expect(firstParameter.name).toBe('Decentraland Marketplace')
        })

        it("should have called send transaction with the contract's createOrder order operation", async () => {
          await orderService.execute(null, nft, order, fingerprint)
          expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

          const secondParameter = (walletUtils.sendTransaction as jest.Mock)
            .mock.calls[0][1]
          const parametrizedContractExecutionResult = secondParameter(
            marketplaceContract
          )
          expect(parametrizedContractExecutionResult).toBe('executeOrder')
          expect(marketplaceContract.executeOrder).toHaveBeenCalledWith(
            nft.contractAddress,
            nft.tokenId,
            order.price
          )
        })

        it('should have returned the transaction hash', () => {
          return expect(
            orderService.execute(null, nft, order, fingerprint)
          ).resolves.toBe(aTxHash)
        })
      })
    })
  })

  describe('when creating an order', () => {
    const priceInEther = 1
    const priceInWei = utils.parseEther(priceInEther.toString())
    const expiresAt = 123023432

    describe("when the market's contract doesn't exist for the NFT's chainId", () => {
      it('should reject into an exception', () => {
        nft.chainId = 234234
        return expect(
          orderService.create(null, nft, priceInEther, expiresAt)
        ).rejects.toEqual(
          new Error(
            `Could not get a valid contract for Marketplace using chain ${nft.chainId}`
          )
        )
      })
    })

    describe('when the transaction fails', () => {
      beforeEach(() => {
        ;(walletUtils.sendTransaction as jest.Mock).mockRejectedValueOnce(
          aBasicErrorMessage
        )
      })

      it('should reject into an exception', () => {
        return expect(
          orderService.create(null, nft, priceInEther, expiresAt)
        ).rejects.toEqual(aBasicErrorMessage)
      })
    })

    describe('when the transaction is successful', () => {
      beforeEach(() => {
        ;(walletUtils.sendTransaction as jest.Mock).mockResolvedValueOnce(
          aTxHash
        )
      })

      it("should have called send transaction with the marketplace's contract using the nft's chain id", async () => {
        await orderService.create(null, nft, priceInEther, expiresAt)
        expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

        const firstParameter = (walletUtils.sendTransaction as jest.Mock).mock
          .calls[0][0] as ContractData
        expect(firstParameter.chainId).toBe(nft.chainId)
        expect(firstParameter.name).toBe('Decentraland Marketplace')
      })

      it("should have called send transaction with the contract's createOrder order operation", async () => {
        await orderService.create(null, nft, priceInEther, expiresAt)
        expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

        const secondParameter = (walletUtils.sendTransaction as jest.Mock).mock
          .calls[0][1]
        const parametrizedContractExecutionResult = secondParameter(
          marketplaceContract
        )
        expect(parametrizedContractExecutionResult).toBe('createOrder')
        expect(marketplaceContract.createOrder).toHaveBeenCalledWith(
          nft.contractAddress,
          nft.tokenId,
          priceInWei,
          expiresAt
        )
      })

      it('should have returned the transaction hash', () => {
        return expect(
          orderService.create(null, nft, priceInEther, expiresAt)
        ).resolves.toBe(aTxHash)
      })
    })
  })

  describe('when cancelling the order', () => {
    describe("when the market's contract doesn't exist for the NFT's chainId", () => {
      it('should reject into an exception', () => {
        nft.chainId = 234234
        return expect(orderService.cancel(null, nft)).rejects.toEqual(
          new Error(
            `Could not get a valid contract for Marketplace using chain ${nft.chainId}`
          )
        )
      })
    })

    describe('when the transaction fails', () => {
      beforeEach(() => {
        ;(walletUtils.sendTransaction as jest.Mock).mockRejectedValueOnce(
          aBasicErrorMessage
        )
      })

      it('should reject into an exception', () => {
        return expect(orderService.cancel(null, nft)).rejects.toEqual(
          aBasicErrorMessage
        )
      })
    })

    describe('when the transaction is successful', () => {
      beforeEach(() => {
        ;(walletUtils.sendTransaction as jest.Mock).mockResolvedValueOnce(
          aTxHash
        )
      })

      it("should have called send transaction with the marketplace's contract using the nft's chain id", async () => {
        await orderService.cancel(null, nft)
        expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

        const firstParameter = (walletUtils.sendTransaction as jest.Mock).mock
          .calls[0][0] as ContractData
        expect(firstParameter.chainId).toBe(nft.chainId)
        expect(firstParameter.name).toBe('Decentraland Marketplace')
      })

      it("should have called send transaction with the contract's cancel order operation", async () => {
        await orderService.cancel(null, nft)
        expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalled()

        const secondParameter = (walletUtils.sendTransaction as jest.Mock).mock
          .calls[0][1]
        const parametrizedContractExecutionResult = secondParameter(
          marketplaceContract
        )
        expect(parametrizedContractExecutionResult).toBe('cancelOrder')
        expect(marketplaceContract.cancelOrder).toHaveBeenCalledWith(
          nft.contractAddress,
          nft.tokenId
        )
      })

      it('should have returned the transaction hash', () => {
        return expect(orderService.cancel(null, nft)).resolves.toBe(aTxHash)
      })
    })
  })

  describe('when asking if is possible to sell through the service', () => {
    it('should return true', () => {
      expect(orderService.canSell()).toBe(true)
    })
  })
})
