import { Bid, BidSortBy, Trade } from '@dcl/schemas'
import { MARKETPLACE_SERVER_URL, MarketplaceAPI } from './api'

describe('when fetching bids', () => {
  let marketplaceApi: MarketplaceAPI
  let fetchMock: jest.SpyInstance

  beforeEach(() => {
    marketplaceApi = new MarketplaceAPI(MARKETPLACE_SERVER_URL)
    fetchMock = jest.spyOn(marketplaceApi as any, 'fetch').mockResolvedValue([] as Bid[])
  })

  describe('when no parameters are passed', () => {
    it('should call the marketplace api with the right parameters', async () => {
      await marketplaceApi.fetchBids()

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids', { method: 'GET' })
    })
  })

  describe('when the limit and offset params are defined', () => {
    it('should call the marketplace api with correct limit and offset parameters', async () => {
      await marketplaceApi.fetchBids({ limit: 1, offset: 0 })

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids?limit=1&offset=0', { method: 'GET' })
    })
  })

  describe('when the bidder param is defined', () => {
    it('should call the marketplace api with correct bidder parameters', async () => {
      await marketplaceApi.fetchBids({ bidder: '0x1234' })

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids?bidder=0x1234', { method: 'GET' })
    })
  })

  describe('when the sortBy parameter is defined', () => {
    it('should call the marketplace api with limit and offset parameters', async () => {
      await marketplaceApi.fetchBids({ sortBy: BidSortBy.MOST_EXPENSIVE })

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids?sortBy=most_expensive', { method: 'GET' })
    })
  })
})

describe('when fetching bids', () => {
  let marketplaceApi: MarketplaceAPI
  let fetchMock: jest.SpyInstance

  beforeEach(() => {
    marketplaceApi = new MarketplaceAPI(MARKETPLACE_SERVER_URL)
    fetchMock = jest.spyOn(marketplaceApi as any, 'fetch').mockResolvedValue([] as Bid[])
  })

  describe('when no parameters are passed', () => {
    it('should call the marketplace api with the right parameters', async () => {
      await marketplaceApi.fetchBids()

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids', { method: 'GET' })
    })
  })

  describe('when the limit and offset params are defined', () => {
    it('should call the marketplace api with correct limit and offset parameters', async () => {
      await marketplaceApi.fetchBids({ limit: 1, offset: 0 })

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids?limit=1&offset=0', { method: 'GET' })
    })
  })

  describe('when the bidder param is defined', () => {
    it('should call the marketplace api with correct bidder parameters', async () => {
      await marketplaceApi.fetchBids({ bidder: '0x1234' })

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids?bidder=0x1234', { method: 'GET' })
    })
  })

  describe('when the sortBy parameter is defined', () => {
    it('should call the marketplace api with limit and offset parameters', async () => {
      await marketplaceApi.fetchBids({ sortBy: BidSortBy.MOST_EXPENSIVE })

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids?sortBy=most_expensive', { method: 'GET' })
    })
  })
})

describe('when fetching a trade by id', () => {
  let marketplaceApi: MarketplaceAPI
  let fetchMock: jest.SpyInstance

  beforeEach(() => {
    marketplaceApi = new MarketplaceAPI(MARKETPLACE_SERVER_URL)
    fetchMock = jest.spyOn(marketplaceApi as any, 'fetch').mockResolvedValue({} as Trade)
  })

  it('should call the marketplace api with the right parameters', async () => {
    await marketplaceApi.fetchTrade('tradeId')

    expect(fetchMock).toHaveBeenCalledWith('/v1/trades/tradeId', { method: 'GET' })
  })
})

describe('when fetching bids', () => {
  let marketplaceApi: MarketplaceAPI
  let fetchMock: jest.SpyInstance

  beforeEach(() => {
    marketplaceApi = new MarketplaceAPI(MARKETPLACE_SERVER_URL)
    fetchMock = jest.spyOn(marketplaceApi as any, 'fetch').mockResolvedValue([] as Bid[])
  })

  describe('when no parameters are passed', () => {
    it('should call the marketplace api with the right parameters', async () => {
      await marketplaceApi.fetchBids()

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids', { method: 'GET' })
    })
  })

  describe('when the limit and offset params are defined', () => {
    it('should call the marketplace api with correct limit and offset parameters', async () => {
      await marketplaceApi.fetchBids({ limit: 1, offset: 0 })

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids?limit=1&offset=0', { method: 'GET' })
    })
  })

  describe('when the bidder param is defined', () => {
    it('should call the marketplace api with correct bidder parameters', async () => {
      await marketplaceApi.fetchBids({ bidder: '0x1234' })

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids?bidder=0x1234', { method: 'GET' })
    })
  })

  describe('when the sortBy parameter is defined', () => {
    it('should call the marketplace api with limit and offset parameters', async () => {
      await marketplaceApi.fetchBids({ sortBy: BidSortBy.MOST_EXPENSIVE })

      expect(fetchMock).toHaveBeenCalledWith('/v1/bids?sortBy=most_expensive', { method: 'GET' })
    })
  })
})
