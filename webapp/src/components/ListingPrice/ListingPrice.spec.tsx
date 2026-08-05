import { render, screen, waitFor } from '@testing-library/react'
import { Network, TradeAssetType } from '@dcl/schemas'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { clearTradePriceDenominationCache } from '../../modules/trade/denomination'
import ListingPrice from './ListingPrice'

jest.mock('decentraland-dapps/dist/modules/trades/TradeService')

jest.mock('../ManaToFiat', () => ({
  ManaToFiat: jest.fn(({ mana }) => <div data-testid="mana-to-fiat">{mana}</div>)
}))

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
    it('should render the price in credits', async () => {
      // 0.5 USD wei = 5 credits. Rendered as MANA this reads "0.5".
      mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      render(<ListingPrice price="500000000000000000" network={Network.MATIC} tradeId="trade-usd-pegged" showFiat />)

      await waitFor(() => expect(screen.getByTestId('credits-price')).toBeInTheDocument())
      expect(screen.getByTestId('credits-price')).toHaveTextContent('5')
      expect(screen.getByTestId('credits-price')).toHaveTextContent('($0.50)')
      expect(screen.queryByTestId('mana-to-fiat')).not.toBeInTheDocument()
    })
  })

  describe('when the backing trade is a plain ERC20 (MANA) trade', () => {
    it('should keep rendering the price as MANA with its fiat conversion', async () => {
      const fetchTrade = mockTradeWithReceivedAssetType(TradeAssetType.ERC20)
      render(<ListingPrice price="500000000000000000" network={Network.MATIC} tradeId="trade-mana" showFiat />)

      await waitFor(() => expect(fetchTrade).toHaveBeenCalledWith('trade-mana'))
      expect(screen.queryByTestId('credits-price')).not.toBeInTheDocument()
      expect(screen.getByText('0.5')).toBeInTheDocument()
      expect(screen.getByTestId('mana-to-fiat')).toHaveTextContent('500000000000000000')
    })
  })

  describe('when there is no backing trade', () => {
    it('should render the price as MANA without reading any trade', () => {
      const fetchTrade = mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      render(<ListingPrice price="500000000000000000" network={Network.MATIC} />)

      expect(fetchTrade).not.toHaveBeenCalled()
      expect(screen.queryByTestId('credits-price')).not.toBeInTheDocument()
      expect(screen.getByText('0.5')).toBeInTheDocument()
    })
  })
})
