import { getBasename } from './basename'

describe('when getting the basename', () => {
  let originalLocation: Location

  beforeEach(() => {
    originalLocation = window.location
    delete (window as { location?: unknown }).location
  })

  afterEach(() => {
    window.location = originalLocation
  })

  describe('and the host is decentraland.org', () => {
    beforeEach(() => {
      window.location = { host: 'decentraland.org' } as Location
    })

    it('should return /marketplace', () => {
      expect(getBasename()).toBe('/marketplace')
    })
  })

  describe('and the host is decentraland.zone', () => {
    beforeEach(() => {
      window.location = { host: 'decentraland.zone' } as Location
    })

    it('should return /marketplace', () => {
      expect(getBasename()).toBe('/marketplace')
    })
  })

  describe('and the host is decentraland.today', () => {
    beforeEach(() => {
      window.location = { host: 'decentraland.today' } as Location
    })

    it('should return /marketplace', () => {
      expect(getBasename()).toBe('/marketplace')
    })
  })

  describe('and the host is a decentraland subdomain', () => {
    beforeEach(() => {
      window.location = { host: 'market.decentraland.org' } as Location
    })

    it('should return an empty string', () => {
      expect(getBasename()).toBe('')
    })
  })

  describe('and the host uses a character that looks like a dot', () => {
    beforeEach(() => {
      window.location = { host: 'decentralandXorg' } as Location
    })

    it('should return an empty string', () => {
      expect(getBasename()).toBe('')
    })
  })

  describe('and the host is localhost', () => {
    beforeEach(() => {
      window.location = { host: 'localhost:3000' } as Location
    })

    it('should return an empty string', () => {
      expect(getBasename()).toBe('')
    })
  })
})
