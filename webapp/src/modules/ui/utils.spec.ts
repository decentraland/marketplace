import { Section } from '../vendor/decentraland'
import { isHoverPreviewSection, isListsSection } from './utils'

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
