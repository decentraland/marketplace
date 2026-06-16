import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Network } from '@dcl/schemas'
import { formatWeiToAssetCard } from '../../AssetCard/utils'
import { ManaToFiat } from '../../ManaToFiat'
import PriceComponent from './PriceComponent'
import { Props } from './PriceComponent.types'

// Mock the ManaToFiat component
jest.mock('../../ManaToFiat', () => ({
  ManaToFiat: jest.fn(({ mana }) => <div data-testid="mana-to-fiat">{mana}</div>)
}))

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
})
