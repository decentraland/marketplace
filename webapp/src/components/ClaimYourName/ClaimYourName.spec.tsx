import { render, fireEvent } from '@testing-library/react'
import ClaimYourName from './ClaimYourName'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import * as events from '../../utils/events'

jest.mock('../../lib/environment', () => {
  return {
    builderUrl: 'https://mocked-builder-url.com'
  }
})

jest.mock('decentraland-dapps/dist/modules/analytics/utils')

const mockGetAnalytics = getAnalytics as jest.MockedFunction<
  typeof getAnalytics
>

describe('ClaimYourName', () => {
  it('should have a link to the builder with the names path', async () => {
    const { findByRole } = render(<ClaimYourName />)
    const button = await findByRole('button')
    expect(button.getAttribute('href')).toBe(
      `https://mocked-builder-url.com/claim-name`
    )
  })

  describe('when tracking the event that the button was clicked', () => {
    let track: jest.Mock

    beforeEach(() => {
      track = jest.fn()

      mockGetAnalytics.mockReturnValueOnce({
        track
      })
    })

    it('should track an event when the user clicks on the button', async () => {
      const { findByRole } = render(<ClaimYourName />)
      // TODO: Fix the "Error: Not implemented: navigation (except hash changes)" that happens because of the href.
      fireEvent.click(await findByRole('button'))
      expect(track).toHaveBeenCalledWith(events.CLICK_CLAIM_NEW_NAME)
    })

    it('should track an event when the user right clicks on the button', async () => {
      const { findByRole } = render(<ClaimYourName />)
      fireEvent.contextMenu(await findByRole('button'))
      expect(track).toHaveBeenCalledWith(events.CLICK_CLAIM_NEW_NAME)
    })
  })
})
