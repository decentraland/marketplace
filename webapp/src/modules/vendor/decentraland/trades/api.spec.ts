import { Trade, TradeCreation } from '@dcl/schemas'
import { MARKETPLACE_SERVER_URL, TradesAPI } from './api'

describe('when adding a new trade', () => {
  let tradesApi: TradesAPI
  let fetchMock: jest.SpyInstance
  let trade: TradeCreation

  beforeEach(() => {
    trade = { signer: '0xsigner' } as TradeCreation
    tradesApi = new TradesAPI(MARKETPLACE_SERVER_URL)
    fetchMock = jest.spyOn(tradesApi as any, 'fetch').mockResolvedValue(trade)
  })

  it('should call the marketplace api with the right parameters', async () => {
    await tradesApi.addTrade(trade)

    expect(fetchMock).toHaveBeenCalledWith('/v1/trades', {
      method: 'POST',
      body: JSON.stringify(trade),
      metadata: { signer: 'dcl:marketplace', intent: 'dcl:marketplace:create-trade' },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  describe('when the marketplace api responds successfully', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValueOnce(trade)
    })

    it('should resolve with the new trade', async () => {
      await expect(tradesApi.addTrade(trade)).resolves.toBe(trade)
    })
  })

  describe('when the marketplace throws an error', () => {
    let error: string

    beforeEach(() => {
      error = 'some error'
      fetchMock.mockRejectedValue(new Error(error))
    })

    it('should throw the error', async () => {
      await expect(tradesApi.addTrade(trade)).rejects.toThrow(error)
    })
  })
})

describe('when fetching a trade by id', () => {
  let tradesApi: TradesAPI
  let fetchMock: jest.SpyInstance

  beforeEach(() => {
    tradesApi = new TradesAPI(MARKETPLACE_SERVER_URL)
    fetchMock = jest.spyOn(tradesApi as any, 'fetch').mockResolvedValue({} as Trade)
  })

  it('should call the marketplace api with the right parameters', async () => {
    await tradesApi.fetchTrade('tradeId')

    expect(fetchMock).toHaveBeenCalledWith('/v1/trades/tradeId', { method: 'GET' })
  })
})
