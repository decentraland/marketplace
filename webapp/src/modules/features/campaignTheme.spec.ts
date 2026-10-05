import { parseCampaignTheme } from './campaignTheme'

describe('when parsing a campaign theme', () => {
  describe('and the value names a theme this build has', () => {
    it('should return it', () => {
      expect(parseCampaignTheme('halloween')).toBe('halloween')
    })
  })

  describe('and the value is spelled as a dashboard reader would type it', () => {
    it('should forgive the casing and the spacing', () => {
      expect(parseCampaignTheme('Halloween')).toBe('halloween')
      expect(parseCampaignTheme('  HALLOWEEN  ')).toBe('halloween')
    })
  })

  describe('and the value names a theme this build cannot paint', () => {
    it('should return null rather than throw, so an unknown season is simply not dressed', () => {
      expect(parseCampaignTheme('christmas')).toBeNull()
      // The CMS tag for the 2026 event. It is NOT a theme name, which is the whole reason this reads only
      // the flag payload: a build that fell back to the tag would go unthemed here with no way to tell.
      expect(parseCampaignTheme('halloween2026')).toBeNull()
    })
  })

  describe('and the operator took the skin off', () => {
    it('should read the kill switch as no theme', () => {
      expect(parseCampaignTheme('none')).toBeNull()
    })
  })

  describe('and there is no value at all', () => {
    it('should return null', () => {
      expect(parseCampaignTheme(null)).toBeNull()
      expect(parseCampaignTheme(undefined)).toBeNull()
      expect(parseCampaignTheme('')).toBeNull()
      expect(parseCampaignTheme('   ')).toBeNull()
    })
  })
})
