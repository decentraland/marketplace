import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { Network, TradeAssetType } from '@dcl/schemas'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { clearTradePriceDenominationCache } from '../../../modules/trade/denomination'
import { formatWeiToAssetCard } from '../../AssetCard/utils'
import { ManaToFiat } from '../../ManaToFiat'
import PriceComponent from './PriceComponent'
import { Props } from './PriceComponent.types'

// Mock the ManaToFiat component
jest.mock('../../ManaToFiat', () => ({
  ManaToFiat: jest.fn(({ mana }) => <div data-testid="mana-to-fiat">{mana}</div>)
}))

jest.mock('decentraland-dapps/dist/modules/trades/TradeService')

const mockTradeWithReceivedAssetType = (assetType: TradeAssetType) => {
  const fetchTrade = jest.fn().mockResolvedValue({
    received: [{ assetType, contractAddress: '0xmana', amount: '600000000000000000', extra: '' }]
  })
  ;(TradeService as unknown as jest.Mock).mockImplementation(() => ({ fetchTrade }))
  return fetchTrade
}

// Mock the CreditsResponse type
const createMockCredits = () => ({
  totalCredits: 500000000000000000, // 0.5 MANA in wei
  credits: [
    {
      id: '1',
      amount: '500000000000000000',
      availableAmount: '500000000000000000',
      contract: '0x123',
      expiresAt: '1000',
      season: 1,
      signature: '123',
      timestamp: '1000',
      userAddress: '0x123'
    }
  ]
})

const renderComponent = (props: Props) =>
  render(
    <MemoryRouter>
      <PriceComponent {...props} />
    </MemoryRouter>
  )

describe('PriceComponent', () => {
  const mockProps: Props = {
    price: '1000000000000000000', // 1 MANA in wei
    network: Network.ETHEREUM,
    useCredits: false,
    className: 'custom-class'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    clearTradePriceDenominationCache()
  })

  describe('when not using credits', () => {
    it('should render the price correctly', () => {
      renderComponent(mockProps)
      expect(screen.getByText(formatWeiToAssetCard(mockProps.price))).toBeInTheDocument()
    })

    it('should render the fiat conversion when price is greater than 0', () => {
      renderComponent(mockProps)
      expect(screen.getByTestId('mana-to-fiat')).toBeInTheDocument()
      expect(ManaToFiat).toHaveBeenCalledWith({ mana: mockProps.price }, {})
    })

    it('should not render the fiat conversion when price is 0', () => {
      renderComponent({ ...mockProps, price: '0' })
      expect(screen.queryByTestId('mana-to-fiat')).not.toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = renderComponent(mockProps)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })
  })

  describe('when using credits', () => {
    const mockCredits = createMockCredits()

    const creditsProps: Props = {
      ...mockProps,
      useCredits: true,
      credits: mockCredits
    }

    it('should render the original and adjusted price', () => {
      renderComponent(creditsProps)

      // Original price
      expect(screen.getByText(formatWeiToAssetCard(mockProps.price))).toBeInTheDocument()

      // Adjusted price (1 MANA - 0.5 MANA = 0.5 MANA)
      const adjustedPrice = (BigInt(mockProps.price) - BigInt(mockCredits.totalCredits.toString())).toString()
      expect(screen.getByText(formatWeiToAssetCard(adjustedPrice))).toBeInTheDocument()
    })

    it('should render the fiat conversion for the adjusted price', () => {
      renderComponent(creditsProps)

      const adjustedPrice = (BigInt(mockProps.price) - BigInt(mockCredits.totalCredits.toString())).toString()
      expect(screen.getByTestId('mana-to-fiat')).toBeInTheDocument()
      expect(ManaToFiat).toHaveBeenCalledWith({ mana: adjustedPrice }, {})
    })

    it('should not render the fiat conversion when adjusted price is 0', () => {
      const zeroAdjustedProps: Props = {
        ...mockProps,
        useCredits: true,
        credits: {
          ...mockCredits,
          totalCredits: 1000000000000000000 // Same as price, so adjusted price will be 0
        }
      }
      renderComponent(zeroAdjustedProps)

      expect(screen.queryByTestId('mana-to-fiat')).not.toBeInTheDocument()
    })

    it('should handle credits greater than price', () => {
      const greaterCreditsProps: Props = {
        ...mockProps,
        useCredits: true,
        credits: {
          ...mockCredits,
          totalCredits: 2000000000000000000 // 2 MANA in wei (greater than price)
        }
      }
      renderComponent(greaterCreditsProps)

      // Original price
      expect(screen.getByText(formatWeiToAssetCard(mockProps.price))).toBeInTheDocument()

      // Adjusted price should be 0
      expect(screen.getByText(formatWeiToAssetCard('0'))).toBeInTheDocument()

      // No fiat conversion should be shown
      expect(screen.queryByTestId('mana-to-fiat')).not.toBeInTheDocument()
    })
  })

  describe('when the backing trade is USD-pegged', () => {
    // The production case: item 0xb7e85d27bf1614201026f8f95e05f13c22ad147b itemId 0, trade
    // 095e3030-a7d0-4c70-9f9e-4c0e5ddb728d — received assetType 2, amount 600000000000000000. That
    // amount is USD wei, so it is 6 credits / $0.60, not "0.6 MANA (~$0.04)".
    const usdPeggedProps: Props = {
      ...mockProps,
      price: '600000000000000000',
      tradeId: 'trade-usd-pegged'
    }

    it('should render the price in credits', async () => {
      mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      renderComponent(usdPeggedProps)

      await waitFor(() => expect(screen.getByTestId('credits-price')).toBeInTheDocument())
      expect(screen.getByTestId('credits-price')).toHaveTextContent('6')
    })

    it('should render the dollar equivalent of the credits, not of the amount read as MANA', async () => {
      mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      renderComponent(usdPeggedProps)

      await waitFor(() => expect(screen.getByTestId('credits-price')).toHaveTextContent('($0.60)'))
    })

    it('should not leave the amount behind the MANA glyph or the MANA/USD conversion', async () => {
      mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      renderComponent(usdPeggedProps)

      await waitFor(() => expect(screen.getByTestId('credits-price')).toBeInTheDocument())
      expect(screen.queryByTestId('mana-to-fiat')).not.toBeInTheDocument()
      // "0.6" is what reading the USD wei amount as MANA produces — the bug being fixed.
      expect(screen.queryByText('0.6')).not.toBeInTheDocument()
    })

    it('should start optimistically as MANA for one paint, then settle on credits', async () => {
      // Documenting a known consequence of resolving the unit asynchronously: the denomination is not
      // knowable until the trade is read, and blanking every MANA price for a round-trip would be a
      // worse regression on the common path than one corrective re-render on the USD-pegged minority.
      mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      renderComponent(usdPeggedProps)

      expect(screen.queryByTestId('credits-price')).not.toBeInTheDocument()
      expect(ManaToFiat).toHaveBeenCalledTimes(1)

      await waitFor(() => expect(screen.getByTestId('credits-price')).toBeInTheDocument())
      expect(ManaToFiat).toHaveBeenCalledTimes(1)
    })

    it('should ignore the MANA-denominated credits discount', async () => {
      mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      renderComponent({ ...usdPeggedProps, useCredits: true, credits: createMockCredits() })

      await waitFor(() => expect(screen.getByTestId('credits-price')).toBeInTheDocument())
      expect(screen.getByTestId('credits-price')).toHaveTextContent('6')
      expect(screen.queryByTestId('mana-to-fiat')).not.toBeInTheDocument()
    })
  })

  describe('when the backing trade is a plain ERC20 (MANA) trade', () => {
    it('should keep rendering the price as MANA', async () => {
      const fetchTrade = mockTradeWithReceivedAssetType(TradeAssetType.ERC20)
      renderComponent({ ...mockProps, tradeId: 'trade-mana' })

      await waitFor(() => expect(fetchTrade).toHaveBeenCalledWith('trade-mana'))
      expect(screen.queryByTestId('credits-price')).not.toBeInTheDocument()
      expect(screen.getByText(formatWeiToAssetCard(mockProps.price))).toBeInTheDocument()
      expect(ManaToFiat).toHaveBeenCalledWith({ mana: mockProps.price }, {})
    })
  })

  describe('when there is no backing trade', () => {
    it('should render the price as MANA without reading any trade', () => {
      const fetchTrade = mockTradeWithReceivedAssetType(TradeAssetType.USD_PEGGED_MANA)
      renderComponent(mockProps)

      expect(fetchTrade).not.toHaveBeenCalled()
      expect(screen.queryByTestId('credits-price')).not.toBeInTheDocument()
      expect(screen.getByText(formatWeiToAssetCard(mockProps.price))).toBeInTheDocument()
    })
  })
})
