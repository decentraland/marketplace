import { Network, ChainId } from '@dcl/schemas'
import * as walletUtils from 'decentraland-dapps/dist/modules/wallet/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT, NFTsCountParams, NFTsFetchParams } from '../../nft/types'
import { VendorName } from '../types'
import { NFTService } from './NFTService'
import * as api from './nft/api'
import { NFTResult, NFTsFetchFilters } from './nft'
import { Order } from '../../order/types'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { getERC721ContractData } from './utils'

jest.mock('decentraland-dapps/dist/modules/wallet/utils')
jest.mock('./nft/api')

const aTxHash = 'txHash'
const anAddress = 'anAddress'
const aBasicErrorMessage = 'error'

describe("Decentraland's NFTService", () => {
  let nftService: NFTService
  let nft: NFT
  let order: Order
  let wallet: Wallet | null
  let erc721Contract: {
    transferFrom: jest.Mock
  }
  let filters: NFTsFetchFilters

  beforeEach(() => {
    nftService = new NFTService()
    nft = {
      id: 'aNFTID',
      chainId: 1,
      contractAddress: '0x2323233423',
      tokenId: 'aTokenId',
      owner: anAddress
    } as NFT
    erc721Contract = {
      transferFrom: jest.fn().mockReturnValue('transferFrom')
    }
    wallet = { address: anAddress } as Wallet
    order = { id: 'anID' } as Order
    filters = { isWearableAccessory: true }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when fetching NFTs', () => {
    let fetchParams: NFTsFetchParams

    beforeEach(() => {
      fetchParams = { first: 1, skip: 1, onlyOnSale: true }
    })

    describe('when the fetch fails', () => {
      beforeEach(() => {
        ;(api.nftAPI.fetch as jest.Mock).mockRejectedValueOnce(
          aBasicErrorMessage
        )
      })

      it("should reject with the fetch's error", () => {
        return expect(nftService.fetch(fetchParams, filters)).rejects.toEqual(
          aBasicErrorMessage
        )
      })
    })

    describe('when the fetch is successful', () => {
      const total = 3
      let nftResults: NFTResult[]
      let anotherNFT: NFT

      beforeEach(() => {
        anotherNFT = { ...nft, owner: 'anotherAddress', id: 'anotherNFTID' }
        nftResults = [
          { nft, order },
          { nft: anotherNFT, order: null }
        ]
        ;(api.nftAPI.fetch as jest.Mock).mockResolvedValueOnce({
          data: nftResults,
          total
        })
      })

      it('should have fetched the NFTs with the filter and NFT params', async () => {
        await nftService.fetch(fetchParams, filters)
        expect(api.nftAPI.fetch as jest.Mock).toHaveBeenCalledWith(
          fetchParams,
          filters
        )
      })

      it('should return the NFTs, the accounts, the orders and the total', () => {
        return expect(nftService.fetch(fetchParams, filters)).resolves.toEqual([
          [
            { ...nft, vendor: VendorName.DECENTRALAND },
            { ...anotherNFT, vendor: VendorName.DECENTRALAND }
          ],
          [
            { address: nft.owner, id: nft.owner, nftIds: [nft.id] },
            {
              address: anotherNFT.owner,
              id: anotherNFT.owner,
              nftIds: [anotherNFT.id]
            }
          ],
          [order],
          total
        ])
      })
    })
  })

  describe('when fetching the number of NFTs', () => {
    let countParams: NFTsCountParams

    beforeEach(() => {
      countParams = { search: 'somethingToSearch' }
    })

    describe('when the fetch fails', () => {
      beforeEach(() => {
        ;(api.nftAPI.fetch as jest.Mock).mockRejectedValueOnce(
          aBasicErrorMessage
        )
      })

      it("should reject with the fetch's error", () => {
        return expect(nftService.count(countParams, filters)).rejects.toEqual(
          aBasicErrorMessage
        )
      })
    })

    describe('when the fetch is successful', () => {
      const total = 1

      beforeEach(() => {
        ;(api.nftAPI.fetch as jest.Mock).mockResolvedValueOnce({ total })
      })

      it('should have fetched the NFTs with the count and filter params, with the first and skip params as 0', async () => {
        await nftService.count(countParams, filters)
        expect(api.nftAPI.fetch as jest.Mock).toHaveBeenCalledWith(
          {
            ...countParams,
            skip: 0,
            first: 0
          },
          filters
        )
      })

      it('should resolve with the number of NFTs', () => {
        return expect(nftService.count(countParams, filters)).resolves.toBe(
          total
        )
      })
    })
  })

  describe('when fetching one NFT', () => {
    describe('when the fetch fails', () => {
      beforeEach(() => {
        ;(api.nftAPI.fetchOne as jest.Mock).mockRejectedValueOnce(
          aBasicErrorMessage
        )
      })

      it("should reject with the fetch's error", () => {
        return expect(
          nftService.fetchOne(nft.contractAddress, nft.id)
        ).rejects.toEqual(aBasicErrorMessage)
      })
    })

    describe('when the fetch is successful', () => {
      beforeEach(() => {
        ;(api.nftAPI.fetchOne as jest.Mock).mockResolvedValueOnce({
          order,
          nft
        })
      })

      it('should fetch the NFT with the provided address and the token ID', async () => {
        await nftService.fetchOne(nft.contractAddress, nft.id)
        expect(api.nftAPI.fetchOne as jest.Mock).toHaveBeenCalledWith(
          nft.contractAddress,
          nft.id
        )
      })

      it('should return the NFT with its vendor and the order', () => {
        return expect(
          nftService.fetchOne(nft.contractAddress, nft.id)
        ).resolves.toEqual([{ ...nft, vendor: VendorName.DECENTRALAND }, order])
      })
    })
  })

  describe('when transferring a NFT', () => {
    describe('when the wallet it null', () => {
      beforeEach(() => {
        wallet = null
      })
      it('should reject into a "Wallet must be connected" error', () => {
        return expect(
          nftService.transfer(null, 'anAddress', nft)
        ).rejects.toThrowError('Invalid address. Wallet must be connected.')
      })
    })

    describe('when the NFT network is Ethereum', () => {
      beforeEach(() => {
        nft.network = Network.ETHEREUM
      })
      describe('when the transaction fails', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockRejectedValueOnce(
            aBasicErrorMessage
          )
        })

        it("should reject with the transaction's error", () => {
          return expect(
            nftService.transfer(wallet, anAddress, nft)
          ).rejects.toBe(aBasicErrorMessage)
        })
      })

      describe('when the transaction is successful', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockResolvedValueOnce(
            aTxHash
          )
        })

        it("should have called send transaction with the erc721's crafted contract using the nft's chain id, the contract address and the ABI", async () => {
          const contract: ContractData = {
            ...getContract(ContractName.ERC721, nft.chainId),
            address: nft.contractAddress
          }
          await nftService.transfer(wallet, anAddress, nft)
          expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalledWith(
            contract,
            'transferFrom',
            wallet?.address,
            anAddress,
            nft.tokenId
          )
        })

        it("should have called send transaction with the contract's createOrder order operation", async () => {
          await nftService.transfer(wallet, anAddress, nft)

          expect(walletUtils.sendTransaction).toHaveBeenCalledWith(
            getERC721ContractData(nft),
            'transferFrom',
            wallet!.address,
            anAddress,
            nft.tokenId
          )
        })

        it("should resolve with the transaction's hash", () => {
          return expect(
            nftService.transfer(wallet, 'anAddress', nft)
          ).resolves.toBe(aTxHash)
        })
      })
    })

    describe('when the NFT network is not Ethereum', () => {
      beforeEach(() => {
        nft.network = Network.MATIC
        nft.chainId = ChainId.MATIC_MAINNET
      })

      describe('when the transaction fails', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockRejectedValueOnce(
            aBasicErrorMessage
          )
        })

        it("should reject with the transaction's error", () => {
          return expect(
            nftService.transfer(wallet, anAddress, nft)
          ).rejects.toBe(aBasicErrorMessage)
        })
      })

      describe('when the transaction is successful', () => {
        beforeEach(() => {
          ;(walletUtils.sendTransaction as jest.Mock).mockResolvedValueOnce(
            aTxHash
          )
        })

        it("should have called send transaction with the erc721's contract using the nft's chain id and contract address", async () => {
          const contract: ContractData = {
            ...getContract(ContractName.ERC721CollectionV2, nft.chainId),
            address: nft.contractAddress
          }
          await nftService.transfer(wallet, anAddress, nft)
          expect(walletUtils.sendTransaction as jest.Mock).toHaveBeenCalledWith(
            contract,
            'transferFrom',
            wallet?.address,
            anAddress,
            nft.tokenId
          )
        })

        it("should have called send transaction with the contract's createOrder order operation", async () => {
          await nftService.transfer(wallet, anAddress, nft)

          expect(walletUtils.sendTransaction).toHaveBeenCalledWith(
            getERC721ContractData(nft),
            'transferFrom',
            wallet!.address,
            anAddress,
            nft.tokenId
          )
        })

        it("should resolve with the transaction's hash", () => {
          return expect(
            nftService.transfer(wallet, 'anAddress', nft)
          ).resolves.toBe(aTxHash)
        })
      })
    })
  })
})
