import { AssetStatusFilter } from '../../utils/filters'
import { View } from '../ui/types'
import { getPersistedIsMapProperty } from '../ui/utils'
import { Section } from '../vendor/decentraland/routing'
import { BrowseOptions } from './types'
import { CATALOG_VIEWS, getClearedBrowseOptions, isCatalogView, isMapSet } from './utils'
jest.mock('../ui/utils')

const mockedGetPersistedIsMapProperty = getPersistedIsMapProperty as unknown as jest.MockedFunction<typeof getPersistedIsMapProperty>

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
  describe('and its a catalog view that should render the status filter', () => {
    beforeEach(() => {
      baseBrowseOptions = {
        page: 1,
        view: View.MARKET
      }
    })
    it('should set the default status filter option', () => {
      expect(getClearedBrowseOptions(baseBrowseOptions)).toStrictEqual({
        ...baseBrowseOptions,
        status: AssetStatusFilter.ON_SALE
      })
    })
  })

  describe('and its not a catalog view', () => {
    beforeEach(() => {
      baseBrowseOptions = {
        onlyOnSale: false,
        page: 1,
        view: View.CURRENT_ACCOUNT,
        section: Section.WEARABLES
      }
    })
    it('should not set the status filter option', () => {
      expect(getClearedBrowseOptions(baseBrowseOptions)).toStrictEqual({
        ...baseBrowseOptions,
        onlyOnSale: true
      })
    })
  })

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

describe('when checking if a view is a Catalog View type', () => {
  describe('and the creators filter is set', () => {
    it.each(CATALOG_VIEWS)('should return true for %s', view => {
      expect(isCatalogView(view)).toBe(true)
    })
  })
})
