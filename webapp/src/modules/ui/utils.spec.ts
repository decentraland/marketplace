import { Section } from '../vendor/decentraland'
import { isListsSection } from './utils'

describe('when getting if the section is lists', () => {
  it('should return true when it is', () => {
    expect(isListsSection(Section.LISTS)).toBe(true)
  })

  it('should return true when it is not', () => {
    expect(isListsSection(Section.COLLECTIONS)).toBe(false)
  })
})
