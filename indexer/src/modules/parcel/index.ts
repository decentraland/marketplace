import { log, BigInt, Address } from '@graphprotocol/graph-ts'
import { LANDRegistry } from '../../entities/LANDRegistry/LANDRegistry'
import { NFT, Parcel } from '../../entities/schema'
import { toLowerCase } from '../../modules/utils'
import * as addresses from '../../data/addresses'

export function buildParcelFromNFT(nft: NFT): Parcel {
  let parcel = new Parcel(nft.id)
  let coordinates = decodeTokenId(nft.tokenId)

  parcel.x = coordinates[0]
  parcel.y = coordinates[1]
  parcel.tokenId = nft.tokenId
  parcel.owner = nft.owner
  return parcel
}

export function decodeTokenId(assetId: BigInt): BigInt[] {
  let address = Address.fromString(addresses.LANDRegistry)

  let registry = LANDRegistry.bind(address)
  let coordinate = registry.decodeTokenId(assetId)
  return [coordinate.value0, coordinate.value1]
}

export function getParcelText(parcel: Parcel, name: string): string {
  let text = parcel.x.toString() + ',' + parcel.y.toString()
  if (name != '') {
    text += ',' + toLowerCase(name)
  }
  return text
}

export function getParcelImage(parcel: Parcel): string {
  return (
    'https://api.decentraland.org/v1/parcels/' +
    parcel.x.toString() +
    '/' +
    parcel.y.toString() +
    '/map.png'
  )
}

export function isInBounds(x: BigInt, y: BigInt): boolean {
  let lowerBound = BigInt.fromI32(-150)
  let upperBound = BigInt.fromI32(150)
  return (
    x.ge(lowerBound) && x.le(upperBound) && y.ge(lowerBound) && y.le(upperBound)
  )
}
