import { AuthIdentity } from 'decentraland-crypto-fetch'
import { MARKETPLACE_SERVER_URL } from '../nft'
import { CancelledTradesAPI } from './api'
import { CancellationReason, CancelledTradeType, CancelledTradesResponse } from './types'

let api: CancelledTradesAPI
let fetchMock: jest.SpyInstance
let response: CancelledTradesResponse

beforeEach(() => {
  api = new CancelledTradesAPI(MARKETPLACE_SERVER_URL, { identity: {} as AuthIdentity })
  response = { data: [], total: 0 }
  fetchMock = jest.spyOn(api as any, 'fetch').mockResolvedValueOnce(response)
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('when fetching the cancelled trades', () => {
  describe('and filters are provided', () => {
    let result: CancelledTradesResponse

    beforeEach(async () => {
      result = await api.fetchCancelledTrades({ reason: CancellationReason.CONTRACT_SIGNATURE_INDEX_BUMP, first: 100 })
    })

    it('should request the cancelled trades with the filters as query params signed by the marketplace', () => {
      expect(fetchMock).toHaveBeenCalledWith('/v1/cancelled-trades?reason=contract_signature_index_bump&first=100', {
        method: 'GET',
        metadata: { signer: 'dcl:marketplace' }
      })
    })

    it('should resolve with the server response', () => {
      expect(result).toBe(response)
    })
  })

  describe('and several types are provided', () => {
    beforeEach(async () => {
      await api.fetchCancelledTrades({ skip: 100, type: [CancelledTradeType.BID, CancelledTradeType.PUBLIC_NFT_ORDER] })
    })

    it('should repeat the type query param for each type', () => {
      expect(fetchMock).toHaveBeenCalledWith('/v1/cancelled-trades?skip=100&type=bid&type=public_nft_order', expect.anything())
    })
  })

  describe('and no filters are provided', () => {
    beforeEach(async () => {
      await api.fetchCancelledTrades()
    })

    it('should request the cancelled trades without a query string', () => {
      expect(fetchMock).toHaveBeenCalledWith('/v1/cancelled-trades', expect.anything())
    })
  })
})
