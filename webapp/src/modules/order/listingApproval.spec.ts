import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { canListingContractTransfer } from './listingApproval'

jest.mock('decentraland-dapps/dist/lib/eth')

const SELLER = '0x1111111111111111111111111111111111111111'
const LISTING_CONTRACT = '0x480A0f4e360E8964e68858Dd231c2922f1df45Ef'
const NFT_CONTRACT = '0x2222222222222222222222222222222222222222'

let isApprovedForAll: jest.Mock
let getApproved: jest.Mock

beforeEach(() => {
  isApprovedForAll = jest.fn()
  getApproved = jest.fn()
  ;(getNetworkProvider as jest.Mock).mockResolvedValue({})
  jest.spyOn(ethers.providers, 'Web3Provider').mockImplementation(() => ({}) as ethers.providers.Web3Provider)
  jest.spyOn(ethers, 'Contract').mockImplementation(() => ({ isApprovedForAll, getApproved }) as unknown as ethers.Contract)
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('when checking whether a listing contract can transfer the seller NFT', () => {
  describe('and the seller approved the listing contract for the whole collection', () => {
    beforeEach(() => {
      isApprovedForAll.mockResolvedValueOnce(true)
    })

    it('should resolve to true', async () => {
      await expect(canListingContractTransfer(ChainId.MATIC_MAINNET, NFT_CONTRACT, '402', SELLER, LISTING_CONTRACT)).resolves.toBe(true)
    })
  })

  describe('and the seller approved the listing contract for that token only', () => {
    beforeEach(() => {
      isApprovedForAll.mockResolvedValueOnce(false)
      getApproved.mockResolvedValueOnce(LISTING_CONTRACT.toLowerCase())
    })

    it('should resolve to true', async () => {
      await expect(canListingContractTransfer(ChainId.MATIC_MAINNET, NFT_CONTRACT, '402', SELLER, LISTING_CONTRACT)).resolves.toBe(true)
    })
  })

  describe('and the seller revoked every approval of the listing contract', () => {
    beforeEach(() => {
      isApprovedForAll.mockResolvedValueOnce(false)
      getApproved.mockResolvedValueOnce(ethers.constants.AddressZero)
    })

    it('should resolve to false', async () => {
      await expect(canListingContractTransfer(ChainId.MATIC_MAINNET, NFT_CONTRACT, '402', SELLER, LISTING_CONTRACT)).resolves.toBe(false)
    })
  })

  describe('and the approvals cannot be read', () => {
    beforeEach(() => {
      isApprovedForAll.mockRejectedValueOnce(new Error('RPC unavailable'))
    })

    it('should resolve to true so the purchase is not blocked', async () => {
      await expect(canListingContractTransfer(ChainId.MATIC_MAINNET, NFT_CONTRACT, '402', SELLER, LISTING_CONTRACT)).resolves.toBe(true)
    })
  })
})
