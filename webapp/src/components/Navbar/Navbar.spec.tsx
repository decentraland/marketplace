import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

const baseNavbar = jest.fn((_props: Record<string, unknown>) => null)
jest.mock('decentraland-dapps/dist/containers/Navbar', () => ({
  Navbar2: (props: Record<string, unknown>) => baseNavbar(props)
}))

const useIsIAP = jest.fn(() => false)
jest.mock('../../modules/iap/useIAP', () => ({ useIsIAP: () => useIsIAP() }))

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

beforeEach(() => {
  baseNavbar.mockClear()
  useIsIAP.mockReturnValue(false)
})

/**
 * The credits chip is the Shop's, not this app's.
 *
 * Left on, the navbar rendered the LEGACY MANA-denominated credits — "Expiring in 0 days (1 Credit = 1 MANA
 * in value)" — for a programme the marketplace no longer issues or spends. `withCredits` defaults to TRUE in
 * dapps, so this is a prop that has to be passed rather than a default that has to be kept: a future edit
 * that drops it silently brings the chip back.
 */
describe('when rendering the navbar', () => {
  it('should not offer credits the marketplace cannot spend', () => {
    renderNavbar()

    expect(baseNavbar).toHaveBeenCalledWith(expect.objectContaining({ withCredits: false }))
  })

  // The iOS web view renders its own cut-down navbar, and it took the same default.
  it('and it is the in-app view it should not offer them either', () => {
    useIsIAP.mockReturnValue(true)
    renderNavbar()

    expect(baseNavbar).toHaveBeenCalledWith(expect.objectContaining({ withCredits: false }))
  })
})
