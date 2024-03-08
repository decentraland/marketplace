import { getParameter } from './enum'

enum AnEnum {
  A_VALUE = 'a value',
  ANOTHER_VALUE = 'another value'
}

describe('when getting an enum value from a string', () => {
  let enumValues: string[]
  let value: string | null | undefined
  let defaultValue: AnEnum.A_VALUE

  beforeEach(() => {
    enumValues = Object.values(AnEnum)
  })

  describe('and the value is in the enum', () => {
    beforeEach(() => {
      value = AnEnum.ANOTHER_VALUE
    })

    it('should return the value', () => {
      expect(getParameter(enumValues, value, defaultValue)).toEqual(value)
    })
  })

  describe('and the value is not in the enum', () => {
    beforeEach(() => {
      value = 'somethingElse'
    })

    it('should return the default value', () => {
      expect(getParameter(enumValues, value, defaultValue)).toEqual(defaultValue)
    })
  })

  describe('and the value is null', () => {
    beforeEach(() => {
      value = null
    })

    it('should return the default value', () => {
      expect(getParameter(enumValues, value, defaultValue)).toEqual(defaultValue)
    })
  })

  describe('and the value is undefined', () => {
    beforeEach(() => {
      value = undefined
    })

    it('should return the default value', () => {
      expect(getParameter(enumValues, value, defaultValue)).toEqual(defaultValue)
    })
  })
})
