import { Section } from '../vendor/decentraland/routing'
import { getPersistedIsMapProperty } from '../ui/utils'
import { isMapSet } from './utils'
jest.mock('../ui/utils')

const mockedGetPersistedIsMapProperty = (getPersistedIsMapProperty as unknown) as jest.MockedFunction<
  typeof getPersistedIsMapProperty
>

describe('when checking if the map is set', () => {
  let isMap: boolean | undefined
  let section: Section

  describe('and the isMap parameter is undefined', () => {
    beforeEach(() => {
      isMap = undefined
    })

    describe('and the section is not LAND', () => {
      beforeEach(() => {
        section = Section.COLLECTIONS
      })

      it('should return false', () => {
        expect(isMapSet(isMap, section)).toBe(false)
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
          expect(isMapSet(isMap, section)).toBe(true)
        })
      })

      describe('and the isMap property has been persisted as false', () => {
        beforeEach(() => {
          mockedGetPersistedIsMapProperty.mockReturnValueOnce(false)
        })

        it('should return false', () => {
          expect(isMapSet(isMap, section)).toBe(false)
        })
      })

      describe('and the isMap property was not persisted', () => {
        beforeEach(() => {
          mockedGetPersistedIsMapProperty.mockReturnValueOnce(null)
        })

        it('should return false', () => {
          expect(isMapSet(isMap, section)).toBe(false)
        })
      })
    })
  })

  describe('and the isMap parameter is defined and is false', () => {
    beforeEach(() => {
      isMap = false
    })

    it('should return false', () => {
      expect(isMapSet(isMap, Section.LAND)).toBe(false)
    })
  })

  describe('and the isMap parameter is defined and is true', () => {
    beforeEach(() => {
      isMap = true
    })

    it('should return true', () => {
      expect(isMapSet(isMap, Section.LAND)).toBe(true)
    })
  })
})
