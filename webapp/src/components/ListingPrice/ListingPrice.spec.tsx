import { render, screen, waitFor } from '@testing-library/react'
import { Network, TradeAssetType } from '@dcl/schemas'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { clearTradePriceDenominationCache } from '../../modules/trade/denomination'
import ListingPrice from './ListingPrice'

jest.mock('decentraland-dapps/dist/modules/trades/TradeService')

// Resolving a chain id reads app config, which a component spec does not initialise.
jest.mock('decentraland-dapps/dist/lib/eth', () => {
  // Annotated, not cast: a type ASSERTION here trips no-unnecessary-type-assertion, while leaving it untyped
  // trips no-unsafe-return. An annotation satisfies both.
  const actual: typeof import('decentraland-dapps/dist/lib/eth') = jest.requireActual('decentraland-dapps/dist/lib/eth')
  return {
    ...actual,
    getChainIdByNetwork: () => 137
  }
})

jest.mock('../ManaToFiat', () => ({
  ManaToFiat: jest.fn(({ mana }) => <div data-testid="mana-to-fiat">{mana}</div>)
}))

// The oracle read is stubbed; the conversion arithmetic stays real, so these assertions exercise it.
// $0.06686601 per MANA — the live Polygon rate when this was written.
jest.mock('../../modules/trade/manaRate', () => {
  // Annotated, not cast: a type ASSERTION here trips no-unnecessary-type-assertion, while leaving it untyped
  // trips no-unsafe-return. An annotation satisfies both.
  const actual: typeof import('../../modules/trade/manaRate') = jest.requireActual('../../modules/trade/manaRate')
  return {
    ...actual,
    fetchManaUsdRate: jest.fn().mockResolvedValue({ answer: 6686601n, decimals: 8 })
  }
})

const mockTradeWithReceivedAssetType = (assetType: TradeAssetType) => {
  const fetchTrade = jest.fn().mockResolvedValue({
    received: [{ assetType, contractAddress: '0xmana', amount: '500000000000000000', extra: '' }]
  })
  ;(TradeService as unknown as jest.Mock).mockImplementation(() => ({ fetchTrade }))
  return fetchTrade
}

describe('ListingPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearTradePriceDenominationCache()
  })

  describe('when the backing trade is USD-pegged', () => {
    /**
     * This app charges in MANA, so a pegged listing is shown as the MANA it currently costs — converted through
     * the same oracle the contract settles with, and marked approximate because that rate moves before the
     * buyer confirms. The amount is USD wei, so rendering it raw read "0.5" (its dollar figure behind the MANA
     * glyph); showing it as credits was wrong too, since credits are a shop unit and this app has an unrelated
     * Credits programme of its own.
     */
    it('should render the price as approximate MANA', async () => {
      mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      render(<ListingPrice price="500000000000000000" network={Network.MATIC} tradeId="trade-usd-pegged" showFiat />)

      await waitFor(() => expect(screen.getByTestId('pegged-mana-price')).toBeInTheDocument())
      // $0.50 at $0.06686601/MANA ≈ 7.48 MANA — not "0.5", and not "5".
      expect(screen.getByTestId('pegged-mana-price')).toHaveTextContent('~7.48')
    })

    it('should show no dollar figure at all, even when the caller asks for fiat', async () => {
      mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      render(<ListingPrice price="500000000000000000" network={Network.MATIC} tradeId="trade-usd-pegged" showFiat />)

      await waitFor(() => expect(screen.getByTestId('pegged-mana-price')).toBeInTheDocument())
      // The USD amount is what the listing is pegged TO, not what the buyer pays. Showing both invites reading
      // the wrong one as the price.
      expect(screen.getByTestId('pegged-mana-price')).not.toHaveTextContent('$')
      expect(screen.queryByTestId('mana-to-fiat')).not.toBeInTheDocument()
    })
  })

  describe('when the backing trade is a plain ERC20 (MANA) trade', () => {
    it('should keep rendering the price as MANA with its fiat conversion', async () => {
      const fetchTrade = mockTradeWithReceivedAssetType(TradeAssetType.ERC20)
      render(<ListingPrice price="500000000000000000" network={Network.MATIC} tradeId="trade-mana" showFiat />)

      await waitFor(() => expect(fetchTrade).toHaveBeenCalledWith('trade-mana'))
      expect(screen.queryByTestId('pegged-mana-price')).not.toBeInTheDocument()
      expect(screen.getByText('0.5')).toBeInTheDocument()
      expect(screen.getByTestId('mana-to-fiat')).toHaveTextContent('500000000000000000')
    })
  })

  describe('when there is no backing trade', () => {
    it('should render the price as MANA without reading any trade', () => {
      const fetchTrade = mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      render(<ListingPrice price="500000000000000000" network={Network.MATIC} />)

      expect(fetchTrade).not.toHaveBeenCalled()
      expect(screen.queryByTestId('pegged-mana-price')).not.toBeInTheDocument()
      expect(screen.getByText('0.5')).toBeInTheDocument()
    })
  })
})
