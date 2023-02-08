import fetch from "node-fetch"
import * as fs from "fs"

enum TileType {
  OWNED = "owned",
  UNOWNED = "unowned",
  PLAZA = "plaza",
  ROAD = "road",
  DISTRICT = "district",
}

type Tile = {
  id: string; // x,y
  x: number;
  y: number;
  updatedAt: number;
  type: TileType;
  top: boolean;
  left: boolean;
  topLeft: boolean;
  name: string;
  estateId: string;
  owner: string;
  price: number;
  expiresAt: number;
  tokenId: string;
};

const PLAZA_MAX_DISTANCE = 10

async function calculateProximities() {
  const response = await (
    await fetch("https://api.decentraland.org/v2/tiles")
  ).json();
  const tiles: Record<string, Tile> = response.data
  const plazas: Tile[] = []
  const roads: Tile[] = []
  const values = Object.values(tiles)
  const keys = Object.keys(tiles)

  // calculate special tiles
  values.forEach((tile) => {
    if (tile.type === TileType.PLAZA) {
      plazas.push(tile)
    }
    if (tile.type === TileType.ROAD) {
      roads.push(tile)
    }
  })

  const start = Date.now()

  const result = values.reduce<Record<string, any>>((proximities, tile) => {
    if (![TileType.PLAZA, TileType.ROAD].includes(tile.type)) {
      const minDistanceToPlaza = getMinDistanceBetweenTiles(tile, plazas)
      const minDistanceToRoad = getMinDistanceBetweenTiles(tile, roads)
      // We are only considering tiles that have a distance to a plaza of maximun 9 tiles. This is to reduce the
      // size of the proximities file as it will not compile for the amount of parcels that exist in decentraland.
      if (minDistanceToPlaza !== null && minDistanceToPlaza < PLAZA_MAX_DISTANCE || minDistanceToRoad === 0) {
        proximities[tile.id] = {
          p: minDistanceToPlaza && minDistanceToPlaza < PLAZA_MAX_DISTANCE ? minDistanceToPlaza : -1,
          r: minDistanceToRoad === 0
        }
      }
    }
    return proximities
  }, {} as Record<string, any>)

  const resultKeys = Object.keys(result)

  const mapSetters = resultKeys.reduce((str, key) => `${str}p.set("${key}",${JSON.stringify(result[key])});`, '')

  const proximitiesFile = `
    class Proximity {r:boolean;p:i32;}
    export let p: Map<string, Proximity> = new Map();${mapSetters};`
  fs.writeFileSync("src/data/proximities.ts", proximitiesFile)

  console.log(`
  Total time : ${Date.now() - start} milliseconds\n
  Total parcels: ${Object.keys(result).length}\n
  Total plazas: ${plazas.length}\n
  Total roads: ${roads.length}\n
  Total tiles:  ${Object.keys(tiles).length}
  `)
}

function getMinDistanceBetweenTiles(tile: Tile, values: Tile[]) {
  let minDistance: null | number = null
  for (let i = 0; i < values.length && (!minDistance || minDistance > 0); i++) {
    const distance = calculateDistanceBetweenTiles(tile, values[i])
    if (minDistance === null || distance < minDistance) {
      minDistance = distance
    }
  }
  return minDistance
}

function calculateDistanceBetweenTiles(tile1: Tile, tile2: Tile) {
  const distance = Math.abs(tile2.x - tile1.x) + Math.abs(tile2.y - tile1.y)
  return distance === 0 ? distance : distance - 1
}

calculateProximities()
