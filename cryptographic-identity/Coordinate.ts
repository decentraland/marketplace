export function isNumber(param: any): param is number {
  return typeof param === 'number' && !isNaN(param)
}

export type Coordinate = {
  x: number
  y: number
}
export type CoordinateString = string

export function coordinateToString(coordinate: Coordinate): CoordinateString {
  return `${coordinate.x},${coordinate.y}`
}

export function stringToCoordinate(coordinate: string): Coordinate {
  const coordinateSplit = coordinate.split(',')
  if (coordinateSplit.length !== 2) {
    throw new TypeError(`Invalid coordinate: ${coordinate} is not in "x,y" format`)
  }
  const [x, y] = coordinateSplit.map(x => parseInt(x, 10))
  if (isNaN(x) || isNaN(y)) {
    throw new TypeError(`Invalid coordinate: ${coordinate} is not a couple of numbers`)
  }
  return { x, y }
}

export function isCoordinate(arg: any): arg is Coordinate {
  return typeof arg === 'object' && isNumber(arg.x) && isNumber(arg.y)
}
