import { isAddress } from './Address'

const exampleAddress = `0x0f5d2fb29fb7d3cfee444a200298f468908cc942`

describe('Address', () => {
  it('has 42 characters and is a string', () => {
    expect(isAddress(exampleAddress)).toBe(true)
    expect(isAddress(exampleAddress.split(''))).toBe(false)
    expect(isAddress(exampleAddress.slice(1))).toBe(false)
    expect(isAddress(exampleAddress.slice(0, 40))).toBe(false)
    expect(isAddress({})).toBe(false)
  })
})
