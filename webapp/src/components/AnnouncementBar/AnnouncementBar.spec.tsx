import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { config } from '../../config'
import * as events from '../../utils/events'
import AnnouncementBar, { isAnnouncementBarDismissed } from './AnnouncementBar'

jest.mock('decentraland-dapps/dist/modules/analytics/utils', () => ({
  getAnalytics: jest.fn()
}))

const ANNOUNCEMENT_BAR_KEY = 'shop-announcement-bar'
const PATH = '/browse'

const renderComponent = (onDismiss: () => void) =>
  render(
    <MemoryRouter initialEntries={[PATH]}>
      <AnnouncementBar onDismiss={onDismiss} />
    </MemoryRouter>
  )

describe('AnnouncementBar', () => {
  let track: jest.Mock
  let onDismiss: jest.Mock

  beforeEach(() => {
    track = jest.fn()
    onDismiss = jest.fn()
    ;(getAnalytics as jest.Mock).mockReturnValue({ track })
  })

  afterEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('when rendering the call to action', () => {
    let link: HTMLElement

    beforeEach(() => {
      renderComponent(onDismiss)
      link = screen.getByRole('link', { name: t('announcement_bar.cta') })
    })

    it('should point to the shop', () => {
      expect(link).toHaveAttribute('href', expect.stringContaining(config.get('SHOP_URL')))
    })

    it('should tag the link so the shop can attribute the visit to this bar', () => {
      expect(link.getAttribute('href')).toContain('utm_source=marketplace&utm_medium=announcement_bar&utm_campaign=shop_launch')
    })

    it('should open the shop in a new tab so the marketplace context is not lost', () => {
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  describe('when the user clicks the call to action', () => {
    beforeEach(() => {
      renderComponent(onDismiss)
      fireEvent.click(screen.getByRole('link', { name: t('announcement_bar.cta') }))
    })

    it('should track the click with the app and the page it happened on', () => {
      expect(track).toHaveBeenCalledWith(events.CLICK_SHOP_ANNOUNCEMENT_BAR, { source: 'marketplace', path: PATH })
    })
  })

  describe('when the user dismisses the bar', () => {
    beforeEach(() => {
      renderComponent(onDismiss)
      fireEvent.click(screen.getByRole('button', { name: t('announcement_bar.dismiss') }))
    })

    it('should notify the parent so it can reclaim the space', () => {
      expect(onDismiss).toHaveBeenCalled()
    })

    it('should remember the dismissal so it stays hidden on the next visit', () => {
      expect(isAnnouncementBarDismissed()).toBe(true)
    })

    it('should track the dismissal with the app and the page it happened on', () => {
      expect(track).toHaveBeenCalledWith(events.DISMISS_SHOP_ANNOUNCEMENT_BAR, { source: 'marketplace', path: PATH })
    })
  })

  describe('when it has not been dismissed', () => {
    it('should report the bar as not dismissed', () => {
      expect(isAnnouncementBarDismissed()).toBe(false)
    })
  })

  describe('when it was dismissed in a previous visit', () => {
    beforeEach(() => {
      localStorage.setItem(ANNOUNCEMENT_BAR_KEY, '1')
    })

    it('should report the bar as dismissed', () => {
      expect(isAnnouncementBarDismissed()).toBe(true)
    })
  })
})
