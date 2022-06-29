import { config } from '../../config'
import { getMinSaleValueInWei, isPriceTooLow } from './utils'

describe('getMinSaleValueInWei', () => {
  const env = process.env

  afterEach(() => {
    process.env = env
  })

  describe('when getting the min sale value', () => {
    const minSaleValue = '1000000000000000000'

    beforeEach(() => {
      jest.spyOn(config, 'get').mockReturnValueOnce(minSaleValue)
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
      jest.spyOn(config, 'get').mockReturnValueOnce('')
    })

    it('should return false', () => {
      expect(isPriceTooLow('1001010')).toBe(false)
    })
  })

  describe('when there is a min sale value', () => {
    const minSaleValue = '1000000000000000000'

    beforeEach(() => {
      jest.spyOn(config, 'get').mockReturnValueOnce(minSaleValue)
    })

    describe("and there's no price", () => {
      it('should return false', () => {
        expect(isPriceTooLow('')).toBe(false)
      })
    })

    describe('and the price is invalid', () => {
      it('should return false', () => {
        expect(isPriceTooLow('hellooooo')).toBe(false)
      })
    })

    describe("and there's a price", () => {
      it('should return false if the price is greater than the minimum', () => {
        expect(isPriceTooLow('9900000000000000000')).toBe(false)
      })

      it('should return false if the price is equal than the minimum', () => {
        expect(isPriceTooLow(minSaleValue)).toBe(false)
      })

      it('should return true if the price is lower than the minimum', () => {
        expect(isPriceTooLow('500000000000000000')).toBe(true)
      })
    })
  })
})
