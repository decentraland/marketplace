import { NFT, RentalListing, RentalListingPeriod } from '@dcl/schemas'
import { Asset } from '../asset/types'
import { getMaxPriceOfPeriods, getOpenRentalId } from './utils'

describe('when getting the open rental id from an asset', () => {
  let asset: Asset

  describe('and the open rental id is set', () => {
    beforeEach(() => {
      asset = {
        id: 'someAssetId',
        openRentalId: 'aRentalId'
      } as Asset
    })

    it('should return the open rental id', () => {
      expect(getOpenRentalId(asset)).toBe((asset as NFT).openRentalId)
    })
  })

  describe('and the open rental id is not set', () => {
    beforeEach(() => {
      asset = {
        id: 'someAssetId'
      } as Asset
    })

    it('should return null', () => {
      expect(getOpenRentalId(asset)).toBe(null)
    })
  })
})

describe('when getting the max price per day of the periods of a rental', () => {
  let rentalListing: RentalListing

  beforeEach(() => {
    rentalListing = {
      periods: [] as RentalListingPeriod[]
    } as RentalListing
  })

  describe('and all periods have their price per day equal to zero', () => {
    beforeEach(() => {
      rentalListing = {
        ...rentalListing,
        periods: [
          { maxDays: 10, minDays: 10, pricePerDay: '0' },
          { maxDays: 20, minDays: 20, pricePerDay: '0' }
        ]
      }
    })

    it('should return 0', () => {
      expect(getMaxPriceOfPeriods(rentalListing)).toBe('0')
    })
  })

  describe('and all periods hav e different prices', () => {
    beforeEach(() => {
      rentalListing = {
        ...rentalListing,
        periods: [
          { maxDays: 10, minDays: 10, pricePerDay: '10000' },
          { maxDays: 20, minDays: 20, pricePerDay: '20000' }
        ]
      }
    })

    it('should return the most expensive period', () => {
      expect(getMaxPriceOfPeriods(rentalListing)).toBe('20000')
    })
  })
})
