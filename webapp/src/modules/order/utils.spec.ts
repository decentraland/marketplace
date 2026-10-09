import { Order } from '@dcl/schemas'
import { convertDateToDateInputValue, formatOrderPrice } from './utils'

describe('when converting a date to a date input value', () => {
  it('should return the converted date', () => {
    expect(convertDateToDateInputValue(new Date(1663345462000))).toEqual('2022-09-16')
  })
})

describe('when formatting the price of an order for a price input', () => {
  describe('and the order has a price', () => {
    it('should return the price in ether', () => {
      expect(formatOrderPrice({ price: '1500000000000000000' })).toBe('1.5')
    })
  })

  describe('and the order arrived without a price', () => {
    it('should return an empty string instead of throwing', () => {
      expect(formatOrderPrice({ price: null } as unknown as Pick<Order, 'price'>)).toBe('')
    })
  })

  describe('and there is no order', () => {
    it('should return an empty string', () => {
      expect(formatOrderPrice(null)).toBe('')
    })
  })
})
