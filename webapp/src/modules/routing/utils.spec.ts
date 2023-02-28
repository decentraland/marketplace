import { Section } from '../vendor/decentraland/routing'
import { getPersistedIsMapProperty } from '../ui/utils'
import { View } from '../ui/types'
import { getClearedBrowseOptions, isMapSet } from './utils'
import { BrowseOptions } from './types'
jest.mock('../ui/utils')

const mockedGetPersistedIsMapProperty = (getPersistedIsMapProperty as unknown) as jest.MockedFunction<
  typeof getPersistedIsMapProperty
>

describe('when checking if the map is set', () => {
  let isMap: boolean | undefined
  let section: Section
  let view: View | undefined

  describe('and the isMap parameter is undefined', () => {
    beforeEach(() => {
      isMap = undefined
    })

    describe('and the section is not LAND', () => {
      beforeEach(() => {
        section = Section.COLLECTIONS
      })

      it('should return false', () => {
        expect(isMapSet(isMap, section, undefined)).toBe(false)
      })
    })

    describe('and the section is LAND', () => {
      beforeEach(() => {
        section = Section.LAND
      })

      describe('and the isMap property has been persisted as true', () => {
        beforeEach(() => {
          mockedGetPersistedIsMapProperty.mockReturnValueOnce(true)
        })

        it('should return true', () => {
          expect(isMapSet(isMap, section, View.HOME_LAND)).toBe(true)
        })
      })

      describe('and the isMap property has been persisted as false', () => {
        beforeEach(() => {
          mockedGetPersistedIsMapProperty.mockReturnValueOnce(false)
        })

        it('should return false', () => {
          expect(isMapSet(isMap, section, View.HOME_LAND)).toBe(false)
        })
      })

      describe('and the isMap property was not persisted', () => {
        beforeEach(() => {
          mockedGetPersistedIsMapProperty.mockReturnValueOnce(null)
        })

        it('should return false', () => {
          expect(isMapSet(isMap, section, View.HOME_LAND)).toBe(false)
        })
      })

      describe('and the view parameter is defined and is the current account view', () => {
        beforeEach(() => {
          view = View.CURRENT_ACCOUNT
          mockedGetPersistedIsMapProperty.mockReturnValueOnce(null)
        })

        it('should return false', () => {
          expect(isMapSet(isMap, Section.LAND, view)).toBe(false)
        })
      })

      describe('and the view parameter is defined and is the account view', () => {
        beforeEach(() => {
          view = View.ACCOUNT
          mockedGetPersistedIsMapProperty.mockReturnValueOnce(null)
        })

        it('should return false', () => {
          expect(isMapSet(isMap, Section.LAND, view)).toBe(false)
        })
      })
    })
  })

  describe('and the isMap parameter is defined and is false', () => {
    beforeEach(() => {
      isMap = false
    })

    it('should return false', () => {
      expect(isMapSet(isMap, Section.LAND, view)).toBe(false)
    })
  })

  describe('and the isMap parameter is defined and is true', () => {
    beforeEach(() => {
      isMap = true
    })

    it('should return true', () => {
      expect(isMapSet(isMap, Section.LAND, view)).toBe(true)
    })
  })
})

describe('when clearing browser options', () => {
  let baseBrowseOptions: BrowseOptions
  let options: BrowseOptions
  describe('and the creators filter is set', () => {
    beforeEach(() => {
      baseBrowseOptions = {
        onlyOnSale: true,
        page: 1
      }
      options = {
        ...baseBrowseOptions,
        creators: ['creator1', 'creator2']
      }
    })
    it('should remove the creators key from the options', () => {
      expect(getClearedBrowseOptions(options)).toStrictEqual(baseBrowseOptions)
    })
  })
})
