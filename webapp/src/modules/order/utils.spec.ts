import { convertDateToDateInputValue } from './utils'

describe('when converting a date to a date input value', () => {
  it('should return the converted date', () => {
    expect(convertDateToDateInputValue(new Date(1663345462000))).toEqual(
      '2022-09-16'
    )
  })
})
