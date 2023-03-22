export type Coord = {
  x: number,
  y: number
}

function getDistanceBetween(position1: Coord, position2: Coord) {
  return Math.abs(position1.x - position2.x) + Math.abs(position1.y - position2.y)
}

export function getNearestTile(currentPosition: Coord, coords: Array<Coord> = []) {
  if (!coords.length) {
    return undefined;
  }

  let nearestCoord: Coord = coords[0]
  let nearestDistance = getDistanceBetween(currentPosition, { x: nearestCoord.x, y: nearestCoord.y })

  coords.forEach((tile) => {
    const tileDistance = getDistanceBetween(currentPosition, { x: tile.x, y: tile.y })
    if (tileDistance < nearestDistance) {
      nearestDistance = tileDistance
      nearestCoord = tile
    }
  })

  return nearestCoord;
}
