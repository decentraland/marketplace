import { TradeAssetType } from '@dcl/schemas'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { PriceDenomination, clearTradePriceDenominationCache, denominationOfTrade, fetchTradePriceDenomination } from './denomination'

jest.mock('decentraland-dapps/dist/modules/trades/TradeService')

const MANA_ON_AMOY = '0x7ad72b9f944ea9793cf4055d88f81138cc2c63a0'

// Shapes taken from marketplace-api.decentraland.zone/v1/trades/<id>: a native (shop) listing returns
// assetType 2 with the amount in USD wei, a legacy one returns assetType 1 with MANA wei. Both live on
// the same OffChainMarketplaceV2 contract, which is why the contract address cannot discriminate.
const usdPeggedTrade = {
  received: [
    {
      assetType: TradeAssetType.USD_PEGGED_MANA,
      contractAddress: MANA_ON_AMOY,
      amount: '1100000000000000000',
      extra: ''
    }
  ]
} as never

const manaTrade = {
  received: [
    {
      assetType: TradeAssetType.ERC20,
      contractAddress: MANA_ON_AMOY,
      amount: '1234000000000000000000',
      extra: ''
    }
  ]
} as never

describe('modules/trade/denomination', () => {
  let fetchTrade: jest.Mock

  beforeEach(() => {
    clearTradePriceDenominationCache()
    fetchTrade = jest.fn()
    ;(TradeService as unknown as jest.Mock).mockImplementation(() => ({ fetchTrade }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when reading the denomination off a trade', () => {
    it('should report USD_PEGGED for a USD_PEGGED_MANA received asset', () => {
      expect(denominationOfTrade(usdPeggedTrade)).toBe(PriceDenomination.USD_PEGGED)
    })

    it('should report MANA for a plain ERC20 received asset', () => {
      expect(denominationOfTrade(manaTrade)).toBe(PriceDenomination.MANA)
    })

    it('should report MANA when there is no received asset', () => {
      expect(denominationOfTrade({ received: [] } as never)).toBe(PriceDenomination.MANA)
    })
  })

  describe('when fetching the denomination of a trade', () => {
    it('should resolve USD_PEGGED for a native listing', async () => {
      fetchTrade.mockResolvedValueOnce(usdPeggedTrade)
      await expect(fetchTradePriceDenomination('trade-usd')).resolves.toBe(PriceDenomination.USD_PEGGED)
    })

    it('should resolve MANA for a legacy listing', async () => {
      fetchTrade.mockResolvedValueOnce(manaTrade)
      await expect(fetchTradePriceDenomination('trade-mana')).resolves.toBe(PriceDenomination.MANA)
    })

    it('should read a given trade only once', async () => {
      fetchTrade.mockResolvedValue(usdPeggedTrade)

      const results = await Promise.all([
        fetchTradePriceDenomination('trade-usd'),
        fetchTradePriceDenomination('trade-usd'),
        fetchTradePriceDenomination('trade-usd')
      ])

      expect(results).toEqual([PriceDenomination.USD_PEGGED, PriceDenomination.USD_PEGGED, PriceDenomination.USD_PEGGED])
      expect(fetchTrade).toHaveBeenCalledTimes(1)
    })

    describe('and the trade cannot be read', () => {
      it('should fall back to MANA', async () => {
        fetchTrade.mockRejectedValueOnce(new Error('boom'))
        await expect(fetchTradePriceDenomination('trade-broken')).resolves.toBe(PriceDenomination.MANA)
      })

      it('should not cache the failure', async () => {
        fetchTrade.mockRejectedValueOnce(new Error('boom'))
        await fetchTradePriceDenomination('trade-broken')

        fetchTrade.mockResolvedValueOnce(usdPeggedTrade)
        await expect(fetchTradePriceDenomination('trade-broken')).resolves.toBe(PriceDenomination.USD_PEGGED)
        expect(fetchTrade).toHaveBeenCalledTimes(2)
      })
    })
  })
})
