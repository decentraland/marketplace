import { LANDFilters } from './types'
import { browseRentedLAND } from './utils'

describe('when browsing LAND', () => {
  let browse: jest.Mock

  beforeEach(() => {
    browse = jest.fn()
  })

  describe('and it should show only the LAND for rent', () => {
    it('should browse the LAND for rent and not the LAND for sale', () => {
      browseRentedLAND(browse, LANDFilters.ONLY_FOR_RENT)

      expect(browse).toHaveBeenCalledWith({
        onlyOnSale: undefined,
        onlyOnRent: true
      })
    })
  })

  describe('and it should show only the LAND available to buy', () => {
    it('should browse the LAND for rent and not the LAND for sale', () => {
      browseRentedLAND(browse, LANDFilters.ONLY_FOR_SALE)

      expect(browse).toHaveBeenCalledWith({
        onlyOnSale: true,
        onlyOnRent: undefined
      })
    })
  })

  describe('and it should show all LANDs', () => {
    it('should browse the LAND for rent and not the LAND for sale', () => {
      browseRentedLAND(browse, LANDFilters.ALL_LAND)

      expect(browse).toHaveBeenCalledWith({
        onlyOnSale: undefined,
        onlyOnRent: undefined
      })
    })
  })
})
