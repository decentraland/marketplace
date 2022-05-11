import { Item } from '@dcl/schemas'
import { AssetType } from '../../modules/asset/types'
import { getMinSaleValueInWei, isPriceTooLow } from './utils'

describe('getMinSaleValueInWei', () => {
  const env = process.env

  afterEach(() => {
    process.env = env
  })

  describe('when getting the min sale value', () => {
    const minSaleValue = '1000000000000000000'

    beforeEach(() => {
      process.env.REACT_APP_MIN_SALE_VALUE_IN_WEI = minSaleValue
    })
    it('should return the env variable representing the minimum value in wei', () => {
      expect(getMinSaleValueInWei()).toBe(minSaleValue)
    })
  })
})

describe('isPriceTooLow', () => {
  const env = process.env

  afterEach(() => {
    process.env = env
  })

  describe("when there's no min sale value", () => {
    beforeEach(() => {
      process.env.REACT_APP_MIN_SALE_VALUE_IN_WEI = ''
    })

    it('should return true', () => {
      expect(isPriceTooLow(AssetType.ITEM, {} as Item)).toBe(false)
    })
  })

  describe('when there is a min sale value', () => {
    const minSaleValue = '1000000000000000000'

    beforeEach(() => {
      process.env.REACT_APP_MIN_SALE_VALUE_IN_WEI = minSaleValue
    })

    describe('and the asset type is NFT', () => {
      it('should return true', () => {
        expect(isPriceTooLow(AssetType.NFT, {} as Item)).toBe(false)
      })
    })

    describe('and the asset type is ITEM', () => {
      it('should return true if the price is greater than the minimum', () => {
        expect(
          isPriceTooLow(AssetType.ITEM, {
            price: '9900000000000000000'
          } as Item)
        ).toBe(false)
      })

      it('should return false if the price is equal than the minimum', () => {
        expect(
          isPriceTooLow(AssetType.ITEM, { price: minSaleValue } as Item)
        ).toBe(false)
      })

      it('should return false if the price is lower than the minimum', () => {
        expect(
          isPriceTooLow(AssetType.ITEM, {
            price: '500000000000000000'
          } as Item)
        ).toBe(true)
      })
    })
  })
})
