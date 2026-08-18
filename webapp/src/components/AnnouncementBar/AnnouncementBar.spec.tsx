import { fireEvent, render, screen } from '@testing-library/react'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { config } from '../../config'
import * as events from '../../utils/events'
import AnnouncementBar from './AnnouncementBar'

jest.mock('decentraland-dapps/dist/modules/analytics/utils', () => ({
  getAnalytics: jest.fn()
}))

const ANNOUNCEMENT_BAR_KEY = 'shop-announcement-bar'

describe('AnnouncementBar', () => {
  let track: jest.Mock

  beforeEach(() => {
    track = jest.fn()
    ;(getAnalytics as jest.Mock).mockReturnValue({ track })
  })

  afterEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('when it has not been dismissed yet', () => {
    beforeEach(() => {
      render(<AnnouncementBar />)
    })

    it('should point the call to action to the shop', () => {
      expect(screen.getByRole('link', { name: t('announcement_bar.cta') })).toHaveAttribute('href', config.get('SHOP_URL'))
    })

    describe('and the user clicks the call to action', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByRole('link', { name: t('announcement_bar.cta') }))
      })

      it('should track the click', () => {
        expect(track).toHaveBeenCalledWith(events.CLICK_SHOP_ANNOUNCEMENT_BAR)
      })
    })

    describe('and the user dismisses it', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByRole('button', { name: t('announcement_bar.dismiss') }))
      })

      it('should remove the bar from the document', () => {
        expect(screen.queryByRole('link', { name: t('announcement_bar.cta') })).not.toBeInTheDocument()
      })

      it('should remember the dismissal so it stays hidden on the next visit', () => {
        expect(localStorage.getItem(ANNOUNCEMENT_BAR_KEY)).not.toBeNull()
      })

      it('should track the dismissal', () => {
        expect(track).toHaveBeenCalledWith(events.DISMISS_SHOP_ANNOUNCEMENT_BAR)
      })
    })
  })

  describe('when it was already dismissed in a previous visit', () => {
    beforeEach(() => {
      localStorage.setItem(ANNOUNCEMENT_BAR_KEY, '1')
      render(<AnnouncementBar />)
    })

    it('should not render the bar', () => {
      expect(screen.queryByRole('link', { name: t('announcement_bar.cta') })).not.toBeInTheDocument()
    })
  })
})
