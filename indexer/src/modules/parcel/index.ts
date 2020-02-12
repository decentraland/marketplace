import { BigInt, Address } from '@graphprotocol/graph-ts'
import { LANDRegistry } from '../../entities/LANDRegistry/LANDRegistry'
import { NFT, Parcel } from '../../entities/schema'
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

export function getParcelImage(parcel: Parcel): String {
  return (
    'https://api.decentraland.org/v1/parcels/' +
    parcel.x.toString() +
    '/' +
    parcel.y.toString() +
    '/map.png'
  )
}

export function isInBounds(parcel: Parcel): boolean {
  let lowerBound = BigInt.fromI32(-150)
  let upperBound = BigInt.fromI32(150)
  return (
    parcel.x.ge(lowerBound) &&
    parcel.x.le(upperBound) &&
    parcel.y.ge(lowerBound) &&
    parcel.y.le(upperBound)
  )
}
