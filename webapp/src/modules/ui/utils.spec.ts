import { Section } from '../vendor/decentraland'
import { getPersistedIsMapProperty, isHoverPreviewSection, isListsSection, persistIsMapProperty } from './utils'

describe('when getting if the section is lists', () => {
  it('should return true when it is', () => {
    expect(isListsSection(Section.LISTS)).toBe(true)
  })

  it('should return true when it is not', () => {
    expect(isListsSection(Section.COLLECTIONS)).toBe(false)
  })
})

describe('when getting if the section shows hover previews', () => {
  it('should return true for the wearables and emotes sections', () => {
    expect(isHoverPreviewSection(Section.WEARABLES)).toBe(true)
    expect(isHoverPreviewSection(Section.EMOTES)).toBe(true)
  })

  it('should return true for their per-category sections', () => {
    expect(isHoverPreviewSection(Section.WEARABLES_HAT)).toBe(true)
    expect(isHoverPreviewSection(Section.EMOTES_DANCE)).toBe(true)
  })

  it('should return true for lists, which only ever hold wearables and emotes', () => {
    expect(isHoverPreviewSection(Section.LISTS)).toBe(true)
  })

  it('should return false for sections without a 3D model to render', () => {
    expect(isHoverPreviewSection(Section.LAND)).toBe(false)
    expect(isHoverPreviewSection(Section.ENS)).toBe(false)
    expect(isHoverPreviewSection(Section.COLLECTIONS)).toBe(false)
  })

  it('should return false when there is no section', () => {
    expect(isHoverPreviewSection(undefined)).toBe(false)
  })
})

describe('when persisting and reading the map toggle', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('and storage is available', () => {
    beforeEach(() => {
      persistIsMapProperty(true)
    })

    it('should read back the persisted value', () => {
      expect(getPersistedIsMapProperty()).toBe(true)
    })
  })

  describe('and nothing was persisted', () => {
    it('should return null', () => {
      expect(getPersistedIsMapProperty()).toBeNull()
    })
  })

  describe('and the browser denies access to localStorage', () => {
    let localStorageGetter: jest.SpyInstance

    beforeEach(() => {
      localStorageGetter = jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
        throw new DOMException("Failed to read the 'localStorage' property from 'Window'", 'SecurityError')
      })
    })

    afterEach(() => {
      localStorageGetter.mockRestore()
    })

    it('should return null instead of throwing', () => {
      expect(getPersistedIsMapProperty()).toBeNull()
    })

    it('should not throw when persisting the toggle', () => {
      expect(() => persistIsMapProperty(false)).not.toThrow()
    })
  })
})
