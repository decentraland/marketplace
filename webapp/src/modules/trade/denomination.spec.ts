import { TradeAssetType } from '@dcl/schemas'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { PriceDenomination, clearTradePricingCache, denominationOfTrade, fetchTradePricing } from './denomination'

jest.mock('decentraland-dapps/dist/modules/trades/TradeService')

const MANA_ON_AMOY = '0x7ad72b9f944ea9793cf4055d88f81138cc2c63a0'
/** The marketplace the trade settles on. Carried alongside the denomination so the price can be converted
 *  through the aggregator of the version this listing was actually signed against. */
const MARKETPLACE = '0x1b67d0e31eeb6b52d8eeed71d3616c2f5b33b8e7'

// Shapes taken from marketplace-api.decentraland.zone/v1/trades/<id>: a native (shop) listing returns
// assetType 2 with the amount in USD wei, a legacy one returns assetType 1 with MANA wei. Both live on
// the same OffChainMarketplaceV2 contract, which is why the contract address cannot discriminate.
const usdPeggedTrade = {
  contract: MARKETPLACE,
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
  contract: MARKETPLACE,
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
    clearTradePricingCache()
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
      await expect(fetchTradePricing('trade-usd')).resolves.toEqual({
        denomination: PriceDenomination.USD_PEGGED,
        marketplaceAddress: MARKETPLACE
      })
    })

    it('should resolve MANA for a legacy listing', async () => {
      fetchTrade.mockResolvedValueOnce(manaTrade)
      await expect(fetchTradePricing('trade-mana')).resolves.toEqual({
        denomination: PriceDenomination.MANA,
        marketplaceAddress: MARKETPLACE
      })
    })

    it('should read a given trade only once', async () => {
      fetchTrade.mockResolvedValue(usdPeggedTrade)

      const results = await Promise.all([fetchTradePricing('trade-usd'), fetchTradePricing('trade-usd'), fetchTradePricing('trade-usd')])

      const usdPegged = { denomination: PriceDenomination.USD_PEGGED, marketplaceAddress: MARKETPLACE }
      expect(results).toEqual([usdPegged, usdPegged, usdPegged])
      expect(fetchTrade).toHaveBeenCalledTimes(1)
    })

    describe('and the trade cannot be read', () => {
      it('should fall back to MANA', async () => {
        fetchTrade.mockRejectedValueOnce(new Error('boom'))
        // No trade means no settlement contract, so the price surface renders "unavailable" rather than
        // converting through a version this listing may never have been signed against.
        await expect(fetchTradePricing('trade-broken')).resolves.toEqual({
          denomination: PriceDenomination.MANA,
          marketplaceAddress: null
        })
      })

      it('should not cache the failure', async () => {
        fetchTrade.mockRejectedValueOnce(new Error('boom'))
        await fetchTradePricing('trade-broken')

        fetchTrade.mockResolvedValueOnce(usdPeggedTrade)
        await expect(fetchTradePricing('trade-broken')).resolves.toEqual({
          denomination: PriceDenomination.USD_PEGGED,
          marketplaceAddress: MARKETPLACE
        })
        expect(fetchTrade).toHaveBeenCalledTimes(2)
      })
    })
  })
})
