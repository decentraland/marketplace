import { screen } from '@testing-library/react'
import { Network } from '@dcl/schemas'
import { useManaUsdRate } from '../../modules/trade/hooks'
import { renderWithProviders } from '../../utils/test'
import PeggedManaPrice from './PeggedManaPrice'

jest.mock('../../modules/trade/hooks', () => ({ useManaUsdRate: jest.fn() }))

const asMock = useManaUsdRate as jest.Mock

// $1 per MANA, so a USD figure converts to the same number and the assertion can name it.
const READY = { status: 'ready', rate: { answer: 100000000n, decimals: 8 } }

function render(usdWei = '20100000000000000000') {
  return renderWithProviders(<PeggedManaPrice usdWei={usdWei} network={Network.MATIC} />)
}

/**
 * "Still reading" and "cannot be read" are different facts about the oracle, and this component is where
 * the difference is visible. Collapsing them made every price accuse the oracle of being down for the
 * frame before its first read landed — on a grid, once per card.
 */
describe('when the rate is still being read', () => {
  beforeEach(() => asMock.mockReturnValue({ status: 'pending', rate: null }))

  it('should say nothing rather than claim the price is unavailable', () => {
    render()

    expect(screen.getByTestId('pegged-mana-price-loading')).toBeInTheDocument()
    expect(screen.queryByTestId('pegged-mana-price-unavailable')).toBeNull()
    expect(screen.queryByTestId('pegged-mana-price')).toBeNull()
  })
})

describe('when the rate cannot be read', () => {
  beforeEach(() => asMock.mockReturnValue({ status: 'unavailable', rate: null }))

  // The claim is only honest once a read has actually failed, and then it does need saying: a placeholder
  // number next to a Buy button would be worse than admitting there is no figure.
  it('should say the price is unavailable', () => {
    render()

    expect(screen.getByTestId('pegged-mana-price-unavailable')).toBeInTheDocument()
    expect(screen.queryByTestId('pegged-mana-price-loading')).toBeNull()
  })
})

describe('when the rate is in', () => {
  beforeEach(() => asMock.mockReturnValue(READY))

  it('should render the converted figure, marked approximate', () => {
    render()

    expect(screen.getByTestId('pegged-mana-price')).toBeInTheDocument()
    expect(screen.queryByTestId('pegged-mana-price-loading')).toBeNull()
    expect(screen.queryByTestId('pegged-mana-price-unavailable')).toBeNull()
  })

  // A rate that is present but unusable is not a rate: the conversion returns null and the honest answer
  // is the same one a failed read gets.
  it('should fall back to unavailable when the rate cannot produce a figure', () => {
    asMock.mockReturnValue({ status: 'ready', rate: { answer: 0n, decimals: 8 } })
    render()

    expect(screen.getByTestId('pegged-mana-price-unavailable')).toBeInTheDocument()
  })
})
