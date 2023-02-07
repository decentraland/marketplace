import { NFT, Estate, Parcel } from '../../entities/schema'
import { getDistanceToPlaza } from '../parcel'

export function buildEstateFromNFT(nft: NFT): Estate {
  let estate = new Estate(nft.id)

  estate.tokenId = nft.tokenId
  estate.owner = nft.owner
  estate.size = 0
  estate.parcelDistances = []
  estate.adjacentToRoadCount = 0

  return estate
}

export function getEstateImage(estate: Estate): string {
  return (
    'https://api.decentraland.org/v1/estates/' +
    estate.tokenId.toString() +
    '/map.png'
  )
}

export function getParcelDistances(parcel: Parcel | null, parcelDistances: Array<i32> | null): Array<i32> {
  let newDistances = parcelDistances || []

  if (parcel == null) {
    return newDistances!
  }

  let distance = getDistanceToPlaza(parcel!)
  if (distance == -1) {
    return newDistances!
  }

  newDistances.push(distance)
  newDistances.sort((a, b) => a - b)
  return newDistances!
}

export function shouldRecalculateMinDistance(deletedParcel: Parcel | null, estate: Estate | null, estateNFT: NFT | null): boolean {
  if (deletedParcel == null || estate == null || estateNFT == null || estate.parcelDistances == null || estate.parcelDistances.length == 0) {
    return false
  }

  let distance = getDistanceToPlaza(deletedParcel!)
  let distances = estate.parcelDistances!
  if (distance == -1 || distances[0] != distance) {
    return false
  }

  return true
}
