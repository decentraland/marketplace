import { isOfEnumType } from './enums'

enum ANumericEnum {
  A = 1,
  B = 2,
  C = 3
}

enum AnotherNumericEnum {
  A = 4,
  B = 5,
  C = 6
}

enum StringEnum {
  A = '1',
  B = '2',
  C = '3'
}

enum AnotherStringEnum {
  A = '4',
  B = '5',
  C = '6'
}

describe('when checking if a value is of an enum type', () => {
  let value: string | number

  describe('and the value is numeric', () => {
    beforeEach(() => {
      value = 1
    })

    describe('and the value belongs to the enum', () => {
      it('should return true', () => {
        expect(isOfEnumType(value, ANumericEnum)).toBe(true)
      })
    })

    describe('and the value does not belong to the enum', () => {
      it('should return false', () => {
        expect(isOfEnumType(value, AnotherNumericEnum)).toBe(false)
      })
    })
  })

  describe('and the value is a string', () => {
    beforeEach(() => {
      value = '1'
    })

    describe('and the value belongs to the enum', () => {
      it('should return true', () => {
        expect(isOfEnumType(value, StringEnum)).toBe(true)
      })
    })

    describe('and the value does not belong to the enum', () => {
      it('should return false', () => {
        expect(isOfEnumType(value, AnotherStringEnum)).toBe(false)
      })
    })
  })
})
