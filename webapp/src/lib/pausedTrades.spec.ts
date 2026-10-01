import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  assertNotPaused,
  getTradeFailureMessage,
  hasActiveBidFrom,
  isPaused,
  isPausedTradeError,
  isPausedTradeErrorMessage,
  Pausable,
  PausedTradeError
} from './pausedTrades'

describe('when checking if a listing is paused', () => {
  let listing: Pausable

  describe('and the listing is missing', () => {
    beforeEach(() => {
      listing = null
    })

    it('should return false', () => {
      expect(isPaused(listing)).toBe(false)
    })
  })

  describe('and the listing has no paused flag', () => {
    beforeEach(() => {
      listing = {}
    })

    it('should return false', () => {
      expect(isPaused(listing)).toBe(false)
    })
  })

  describe('and the listing is flagged as not paused', () => {
    beforeEach(() => {
      listing = { paused: false }
    })

    it('should return false', () => {
      expect(isPaused(listing)).toBe(false)
    })
  })

  describe('and the listing is flagged as paused', () => {
    beforeEach(() => {
      listing = { paused: true }
    })

    it('should return true', () => {
      expect(isPaused(listing)).toBe(true)
    })
  })
})

describe('when asserting that listings are not paused', () => {
  let listings: Pausable[]

  describe('and none of them is paused', () => {
    beforeEach(() => {
      listings = [{ paused: false }, undefined, {}]
    })

    it('should not throw', () => {
      expect(() => assertNotPaused(...listings)).not.toThrow()
    })
  })

  describe('and one of them is paused', () => {
    beforeEach(() => {
      listings = [{ paused: false }, { paused: true }]
    })

    it('should throw a paused trade error', () => {
      expect(() => assertNotPaused(...listings)).toThrow(PausedTradeError)
    })
  })
})

describe('when checking if an error comes from a paused contract', () => {
  let error: unknown

  describe('and it is the paused trade guard error', () => {
    beforeEach(() => {
      error = new PausedTradeError()
    })

    it('should return true', () => {
      expect(isPausedTradeError(error)).toBe(true)
    })
  })

  describe('and its message carries the legacy Pausable revert reason', () => {
    beforeEach(() => {
      error = new Error('execution reverted: Pausable: paused')
    })

    it('should return true', () => {
      expect(isPausedTradeError(error)).toBe(true)
    })
  })

  describe('and a nested error carries the EnforcedPause custom error', () => {
    beforeEach(() => {
      error = { message: 'cannot estimate gas', error: { message: 'execution reverted', data: { message: 'EnforcedPause()' } } }
    })

    it('should return true', () => {
      expect(isPausedTradeError(error)).toBe(true)
    })
  })

  describe('and its reason carries the EnforcedPause selector', () => {
    beforeEach(() => {
      error = { message: 'call revert exception', reason: 'reverted with data 0xd93c0665' }
    })

    it('should return true', () => {
      expect(isPausedTradeError(error)).toBe(true)
    })
  })

  describe('and it is an unrelated error', () => {
    beforeEach(() => {
      error = new Error('insufficient funds')
    })

    it('should return false', () => {
      expect(isPausedTradeError(error)).toBe(false)
    })
  })
})

describe('when getting the failure message of a trade', () => {
  let error: unknown
  let fallback: string

  beforeEach(() => {
    fallback = 'Unknown error'
  })

  describe('and the error comes from a paused contract', () => {
    beforeEach(() => {
      error = new Error('Pausable: paused')
    })

    it('should return the paused trade copy', () => {
      expect(getTradeFailureMessage(error, fallback)).toBe(t('trading_paused_warning.error'))
    })
  })

  describe('and the error is unrelated', () => {
    beforeEach(() => {
      error = new Error('insufficient funds')
    })

    it('should return the error message', () => {
      expect(getTradeFailureMessage(error, fallback)).toBe('insufficient funds')
    })
  })

  describe('and the error has no message', () => {
    beforeEach(() => {
      error = 'boom'
    })

    it('should return the fallback', () => {
      expect(getTradeFailureMessage(error, fallback)).toBe(fallback)
    })
  })
})

describe('when checking if a failure message is the paused trade copy', () => {
  let message: string | undefined

  describe('and it is the paused trade copy', () => {
    beforeEach(() => {
      message = t('trading_paused_warning.error')
    })

    it('should return true', () => {
      expect(isPausedTradeErrorMessage(message)).toBe(true)
    })
  })

  describe('and it is another message', () => {
    beforeEach(() => {
      message = 'insufficient funds'
    })

    it('should return false', () => {
      expect(isPausedTradeErrorMessage(message)).toBe(false)
    })
  })
})

describe('when checking if an address has an active bid', () => {
  let bids: { bidder: string; paused?: boolean }[]
  let address: string | null | undefined

  beforeEach(() => {
    address = '0xbidder'
  })

  describe('and the address has no bids', () => {
    beforeEach(() => {
      bids = [{ bidder: '0xsomeone-else' }]
    })

    it('should return false', () => {
      expect(hasActiveBidFrom(bids, address)).toBe(false)
    })
  })

  describe('and the address only has a bid on a paused contract', () => {
    beforeEach(() => {
      bids = [{ bidder: '0xbidder', paused: true }]
    })

    it('should return false', () => {
      expect(hasActiveBidFrom(bids, address)).toBe(false)
    })
  })

  describe('and the address has a bid on an active contract', () => {
    beforeEach(() => {
      bids = [{ bidder: '0xbidder', paused: true }, { bidder: '0xbidder' }]
    })

    it('should return true', () => {
      expect(hasActiveBidFrom(bids, address)).toBe(true)
    })
  })

  describe('and there is no address', () => {
    beforeEach(() => {
      bids = [{ bidder: '0xbidder' }]
      address = undefined
    })

    it('should return false', () => {
      expect(hasActiveBidFrom(bids, address)).toBe(false)
    })
  })
})
