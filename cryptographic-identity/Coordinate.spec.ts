import { coordinateToString, isCoordinate, stringToCoordinate } from './Coordinate'

export function isNumber(param: any): param is number {
  return typeof param === 'number' && !isNaN(param) && param !== Infinity && param !== -Infinity && param !== -0
}

describe('isNumber', () => {
  it(`shouldn't allow isNaN as a number`, () => {
    expect(isNumber(NaN)).toBe(false)
  })
  it(`shouldn't allow undefined or null as a number`, () => {
    expect(isNumber(null)).toBe(false)
    expect(isNumber(undefined)).toBe(false)
  })
  it(`shouldn't allow Infinity as a number`, () => {
    expect(isNumber(Infinity)).toBe(false)
  })
  it(`accepts actual numbers as number`, () => {
    expect(isNumber(1)).toBe(true)
    expect(isNumber(1e20)).toBe(true)
  })
})

describe('coordinateToString', () => {
  it('works correctly with some simple examples', () => {
    expect(coordinateToString({ x: 0, y: 0 })).toEqual('0,0')
    expect(coordinateToString({ x: -150, y: 0 })).toEqual('-150,0')
    expect(coordinateToString({ x: 0, y: -150 })).toEqual('0,-150')
    expect(coordinateToString({ x: 300, y: 0 })).toEqual('300,0')
    expect(coordinateToString({ x: 0, y: 800 })).toEqual('0,800')
    expect(coordinateToString({ x: -10, y: -19 })).toEqual('-10,-19')
    expect(coordinateToString({ x: 4000, y: -123 })).toEqual('4000,-123')
    expect(coordinateToString({ x: -1, y: -1 })).toEqual('-1,-1')
  })
})

describe('stringToCoordinate', () => {
  it('works correctly with some simple examples', () => {
    expect(stringToCoordinate('0,0')).toEqual({ x: 0, y: 0 })
    expect(stringToCoordinate('-150,0')).toEqual({ x: -150, y: 0 })
    expect(stringToCoordinate('0,-150')).toEqual({ x: 0, y: -150 })
    expect(stringToCoordinate('300,0')).toEqual({ x: 300, y: 0 })
    expect(stringToCoordinate('0,800')).toEqual({ x: 0, y: 800 })
    expect(stringToCoordinate('-10,-19')).toEqual({ x: -10, y: -19 })
    expect(stringToCoordinate('4000,-123')).toEqual({ x: 4000, y: -123 })
    expect(stringToCoordinate('-1,-1')).toEqual({ x: -1, y: -1 })
  })
})

describe('isCoordinate', () => {
  it('works correctly with a simple example', () => {
    expect(isCoordinate({ x: 1, y: -1 })).toBe(true)
  })
  it(`doesn't care about other properties`, () => {
    expect(isCoordinate({ x: 0, y: 0, z: 1 })).toBe(true)
  })
})
