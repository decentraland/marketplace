import { HEXADECIMAL_REGEXP, PRIVATE_KEY_LENGTH_IN_BYTES, PRIVATE_KEY_LENGTH_IN_HEXA } from './constants'

describe('Hexadecimal regexp', () => {
  it(`false positives don't pass`, () => {
    expect(HEXADECIMAL_REGEXP.test('r')).toBe(false)
    expect(HEXADECIMAL_REGEXP.test('ß')).toBe(false)
    expect(HEXADECIMAL_REGEXP.test('O1')).toBe(false)
  })
  it(`correctly detects some numbers`, () => {
    expect(HEXADECIMAL_REGEXP.test('00')).toBe(true)
    expect(HEXADECIMAL_REGEXP.test('12')).toBe(true)
    expect(HEXADECIMAL_REGEXP.test('64')).toBe(true)
    expect(HEXADECIMAL_REGEXP.test('FF')).toBe(true)
  })
  it(`doesn't care about caps`, () => {
    expect(HEXADECIMAL_REGEXP.test('fF')).toBe(true)
  })
  it(`requires an even number of digits`, () => {
    expect(HEXADECIMAL_REGEXP.test('f')).toBe(false)
  })
  it(`doesn't accept the empty string as a number`, () => {
    expect(HEXADECIMAL_REGEXP.test('')).toBe(false)
  })
})

describe('Private key length', () => {
  it('Has 256 bits, which equals to 64 ascii numbers when represented in hexa', () => {
    expect(PRIVATE_KEY_LENGTH_IN_HEXA).toBe(64)
  })
  it('Has 256 bits, which equals to 32 bytes', () => {
    expect(PRIVATE_KEY_LENGTH_IN_BYTES).toBe(32)
  })
})
