import { render, screen } from '@testing-library/react'
import CreditsPrice from './CreditsPrice'

jest.mock('decentraland-dapps/dist/modules/translation/utils', () => ({
  t: (id: string, values?: Record<string, unknown>) => (values ? `${id}:${JSON.stringify(values)}` : id)
}))

describe('CreditsPrice', () => {
  describe('when given a USD-pegged amount', () => {
    it('should render the credit price, not the raw ether value', () => {
      // 0.6 USD wei — the production case that rendered as "0.6" behind the MANA glyph.
      render(<CreditsPrice usdWei="600000000000000000" />)

      expect(screen.getByTestId('credits-price')).toHaveTextContent('6')
      expect(screen.queryByText('0.6')).not.toBeInTheDocument()
    })

    it('should render the dollar equivalent when asked', () => {
      render(<CreditsPrice usdWei="600000000000000000" showUsd />)

      expect(screen.getByTestId('credits-price')).toHaveTextContent('($0.60)')
    })

    it('should not render the dollar equivalent by default', () => {
      render(<CreditsPrice usdWei="600000000000000000" />)

      expect(screen.getByTestId('credits-price')).not.toHaveTextContent('$')
    })

    it('should round up so the shown price never sits below the charge', () => {
      render(<CreditsPrice usdWei="650000000000000000" />)

      expect(screen.getByTestId('credits-price')).toHaveTextContent('7')
    })

    it('should compact a large amount', () => {
      // $1,200 = 12,000 credits
      render(<CreditsPrice usdWei="1200000000000000000000" />)

      expect(screen.getByTestId('credits-price')).toHaveTextContent('12K')
    })
  })

  describe('when given a malformed amount', () => {
    it('should say the price is unavailable rather than invent one', () => {
      render(<CreditsPrice usdWei="not-a-number" />)

      expect(screen.getByTestId('credits-price-unavailable')).toBeInTheDocument()
      expect(screen.queryByTestId('credits-price')).not.toBeInTheDocument()
    })
  })
})
