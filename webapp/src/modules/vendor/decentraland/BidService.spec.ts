import { Bid, ChainId, Network } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { ContractName, getContract } from 'decentraland-transactions'
import { NFT } from '../../nft/types'
import { BidService } from './BidService'

jest.mock('decentraland-dapps/dist/modules/wallet/utils')

const mockSendTransaction = sendTransaction as jest.MockedFunction<
  typeof sendTransaction
>

let bidService: BidService
const expectedHash = '0xhash'
beforeEach(() => {
  bidService = new BidService()
})

describe('when placing a bid', () => {
  describe('when the wallet is not connected', () => {
    it('should throw an error signaling that the wallet is not available', async () => {
      await expect(bidService.place(null, {} as NFT, 0, 0)).rejects.toThrow(
        'Invalid address. Wallet must be connected.'
      )
    })
  })
  describe('when the nft.network is ETHEREUM', () => {
    it('should send an Ethereum transaction to the Bid contract', async () => {
      mockSendTransaction.mockResolvedValueOnce(expectedHash)
      const hash = await bidService.place(
        {} as Wallet,
        { network: Network.ETHEREUM, chainId: ChainId.ETHEREUM_MAINNET } as NFT,
        0,
        0
      )
      expect(hash).toBe(expectedHash)
      expect(mockSendTransaction).toBeCalledWith(
        getContract(ContractName.Bid, ChainId.ETHEREUM_MAINNET),
        expect.anything()
      )
    })
  })
  describe('when the nft.network is MATIC', () => {
    it('should send an Polygon transaction to the BidV2 contract', async () => {
      mockSendTransaction.mockResolvedValueOnce(expectedHash)
      const hash = await bidService.place(
        {} as Wallet,
        { network: Network.MATIC, chainId: ChainId.MATIC_MAINNET } as NFT,
        0,
        0
      )
      expect(hash).toBe(expectedHash)
      expect(mockSendTransaction).toBeCalledWith(
        getContract(ContractName.BidV2, ChainId.MATIC_MAINNET),
        expect.anything()
      )
    })
  })
})
describe('when accepting a bid', () => {
  describe('when the wallet is not connected', () => {
    it('should throw an error signaling that the wallet is not available', async () => {
      await expect(bidService.accept(null, {} as Bid)).rejects.toThrow(
        'Invalid address. Wallet must be connected.'
      )
    })
  })
  describe('when the wallet is connected', () => {
    const contractAddress = '0xContractAddress'
    describe('when bid.network is on ETHEREUM', () => {
      it('should send an Ethereum transaction to an ERC721 contract', async () => {
        mockSendTransaction.mockResolvedValueOnce(expectedHash)
        const hash = await bidService.accept(
          {} as Wallet,
          {
            contractAddress,
            network: Network.ETHEREUM,
            chainId: ChainId.ETHEREUM_MAINNET
          } as Bid
        )
        expect(hash).toBe(expectedHash)
        expect(mockSendTransaction).toBeCalledWith(
          {
            ...getContract(ContractName.ERC721, ChainId.ETHEREUM_MAINNET),
            address: contractAddress
          },
          expect.anything()
        )
      })
    })
    describe('when the bid.network is MATIC', () => {
      it('should send an Polygon transaction to an ERC721CollectionV2', async () => {
        mockSendTransaction.mockResolvedValueOnce(expectedHash)
        const hash = await bidService.accept(
          {} as Wallet,
          {
            contractAddress,
            network: Network.MATIC,
            chainId: ChainId.MATIC_MAINNET
          } as Bid
        )
        expect(hash).toBe(expectedHash)
        expect(mockSendTransaction).toBeCalledWith(
          {
            ...getContract(
              ContractName.ERC721CollectionV2,
              ChainId.MATIC_MAINNET
            ),
            address: contractAddress
          },
          expect.anything()
        )
      })
    })
  })
})

describe('when canceling a bid', () => {
  describe('when the wallet is not connected', () => {
    it('should throw an error signaling that the wallet is not available', async () => {
      await expect(bidService.cancel(null, {} as Bid)).rejects.toThrow(
        'Invalid address. Wallet must be connected.'
      )
    })
  })
  describe('when the wallet is connected', () => {
    describe('when bid.network is on ETHEREUM', () => {
      it('should send an Ethereum transaction to the Bid contract', async () => {
        mockSendTransaction.mockResolvedValueOnce(expectedHash)
        const hash = await bidService.cancel(
          {} as Wallet,
          {
            network: Network.ETHEREUM,
            chainId: ChainId.ETHEREUM_MAINNET
          } as Bid
        )
        expect(hash).toBe(expectedHash)
        expect(mockSendTransaction).toBeCalledWith(
          getContract(ContractName.Bid, ChainId.ETHEREUM_MAINNET),
          expect.anything()
        )
      })
    })
    describe('when the bid.network is MATIC', () => {
      it('should send an Polygon transaction to the BidV2 contract', async () => {
        mockSendTransaction.mockResolvedValueOnce(expectedHash)
        const hash = await bidService.cancel(
          {} as Wallet,
          {
            network: Network.MATIC,
            chainId: ChainId.MATIC_MAINNET
          } as Bid
        )
        expect(hash).toBe(expectedHash)
        expect(mockSendTransaction).toBeCalledWith(
          getContract(ContractName.BidV2, ChainId.MATIC_MAINNET),
          expect.anything()
        )
      })
    })
  })
})
