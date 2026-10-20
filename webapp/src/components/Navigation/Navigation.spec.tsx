import { screen } from '@testing-library/react'
import { locations } from '../../modules/routing/locations'
import { renderWithProviders } from '../../utils/test'
import Navigation from './Navigation'
import { NavigationTab, Props } from './Navigation.types'

// A desktop viewport. decentraland-ui's Tabs picks its layout with media queries jsdom cannot answer, so it is
// reduced to plain containers: this spec is about what the bar holds, not how Tabs lays it out.
jest.mock('decentraland-ui', () => {
  const Pass = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>
  const Tabs = Object.assign(Pass, { Left: Pass, Right: Pass, Tab: Pass })
  return {
    ...jest.requireActual<Record<string, unknown>>('decentraland-ui'),
    Tabs,
    Mobile: () => null,
    useMobileMediaQuery: () => false
  }
})

jest.mock('../../modules/iap/useIAP', () => ({
  useIsIAP: () => false
}))

const renderNavigation = (props: Partial<Props> = {}) =>
  renderWithProviders(
    <Navigation
      isCampaignBrowserEnabled={false}
      isConnected={true}
      onOpenBuyManaWithFiatModal={jest.fn()}
      onClearFilters={jest.fn()}
      {...props}
    />
  )

describe('Navigation', () => {
  describe('when the user is signed in', () => {
    it('should show the activity icon linking to the activity page', () => {
      renderNavigation()
      expect(screen.getByTestId('navigation-activity')).toHaveAttribute('href', locations.activity())
      expect(screen.getByRole('link', { name: 'Activity' })).toBe(screen.getByTestId('navigation-activity'))
    })

    describe('and the activity page is open', () => {
      it('should mark the icon as the current page', () => {
        renderNavigation({ activeTab: NavigationTab.ACTIVITY })
        expect(screen.getByTestId('navigation-activity')).toHaveAttribute('aria-current', 'page')
      })
    })
  })

  describe('when the user is not signed in', () => {
    it('should not show the activity icon', () => {
      renderNavigation({ isConnected: false })
      expect(screen.queryByTestId('navigation-activity')).not.toBeInTheDocument()
    })
  })
})
