import { bidAPI } from './api'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('when fetching bids by seller', () => {
  it('should add seller, status and first to the query params', async () => {
    jest.spyOn(bidAPI, 'request').mockResolvedValue([])

    await bidAPI.fetchBySeller('0x123')

    expect(bidAPI.request).toHaveBeenCalledWith(
      'get',
      '/bids?seller=0x123&status=open&first=1000'
    )
  })
})

describe('when fetching bids by bidder', () => {
  it('should add bidder, status and first to the query params', async () => {
    jest.spyOn(bidAPI, 'request').mockResolvedValue([])

    await bidAPI.fetchByBidder('0x123')

    expect(bidAPI.request).toHaveBeenCalledWith(
      'get',
      '/bids?bidder=0x123&status=open&first=1000'
    )
  })
})

describe('when fetching bids by nft', () => {
  it('should add contractAddress, tokenId, status and first to the query params', async () => {
    jest.spyOn(bidAPI, 'request').mockResolvedValue([])

    await bidAPI.fetchByNFT('0x123', '123')

    expect(bidAPI.request).toHaveBeenCalledWith(
      'get',
      '/bids?contractAddress=0x123&tokenId=123&status=open&first=1000&skip=0'
    )
  })
})
