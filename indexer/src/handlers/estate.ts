import { BigInt } from '@graphprotocol/graph-ts'
import {
  CreateEstate,
  AddLand,
  RemoveLand,
  Update,
} from '../entities/EstateRegistry/EstateRegistry'
import { NFT, Parcel, Estate } from '../entities/schema'
import { getNFTId } from '../modules/nft'
import {
  decodeTokenId,
  getAdjacentToRoad,
  getDistanceToPlaza,
} from '../modules/parcel'
import { buildData, DataType } from '../modules/data'
import { createOrLoadAccount } from '../modules/account'
import { toLowerCase } from '../modules/utils'
import {
  getParcelDistances,
  shouldRecalculateMinDistance,
} from '../modules/estate'
import * as categories from '../modules/category/categories'
import * as addresses from '../data/addresses'

export function handleCreateEstate(event: CreateEstate): void {
  let estateId = event.params._estateId.toString()
  let data = event.params._data.toString()

  let id = getNFTId(categories.ESTATE, addresses.EstateRegistry, estateId)

  let estate = new Estate(id)

  estate.tokenId = event.params._estateId
  estate.owner = event.params._owner.toHex()
  estate.rawData = data
  estate.parcelDistances = []
  estate.size = 0
  estate.adjacentToRoadCount = 0

  let estateData = buildData(id, data, DataType.ESTATE)
  if (estateData != null) {
    estate.data = id
    estateData.save()

    let nft = new NFT(id)
    nft.name = estateData.name
    nft.searchText = toLowerCase(estateData.name)
    nft.createdAt = event.block.timestamp
    nft.updatedAt = event.block.timestamp
    nft.searchDistanceToPlaza = -1
    nft.searchAdjacentToRoad = false
    nft.soldAt = null
    nft.sales = 0
    nft.volume = BigInt.fromI32(0)
    nft.save()
  }

  estate.save()

  createOrLoadAccount(event.params._owner)
}

export function handleAddLand(event: AddLand): void {
  let estateId = event.params._estateId.toString()
  let landId = event.params._landId.toString()

  let id = getNFTId(categories.ESTATE, addresses.EstateRegistry, estateId)
  let parcelId = getNFTId(categories.PARCEL, addresses.LANDRegistry, landId)

  let estate = Estate.load(id)

  estate.size += 1

  estate.save()

  let estateNFT = NFT.load(id)
  estateNFT.searchEstateSize = estate.size
  estateNFT.save()

  let parcel = Parcel.load(parcelId)

  if (parcel == null) {
    // Would expect that this isn't needed, but it is here for safety, since failing at block 6,000,000 slows down iterative testing
    let coordinates = decodeTokenId(event.params._landId)

    parcel = new Parcel(parcelId)
    parcel.x = coordinates[0]
    parcel.y = coordinates[1]
    parcel.tokenId = event.params._landId
  }

  parcel.owner = addresses.EstateRegistry
  parcel.estate = id

  let parcelNFT = new NFT(parcelId)
  parcelNFT.searchParcelEstateId = id
  parcelNFT.owner = addresses.EstateRegistry
  parcelNFT.save()

  if (estateNFT != null && estate != null) {
    estate.parcelDistances = getParcelDistances(parcel, estate.parcelDistances)

    let adjacentToRoad = getAdjacentToRoad(parcel!)
    if (adjacentToRoad) {
      estate.adjacentToRoadCount += 1
    }

    estate.save()

    let distances = estate.parcelDistances!
    estateNFT.searchDistanceToPlaza = distances.length ? distances[0] : -1
    estateNFT.searchAdjacentToRoad = estateNFT.searchAdjacentToRoad || adjacentToRoad
    estateNFT.save()
  }

  parcel.save()
}

export function handleRemoveLand(event: RemoveLand): void {
  let estateId = event.params._estateId.toString()
  let landId = event.params._landId.toString()

  let id = getNFTId(categories.ESTATE, addresses.EstateRegistry, estateId)
  let parcelId = getNFTId(categories.PARCEL, addresses.LANDRegistry, landId)

  let estate = Estate.load(id)

  estate.size -= 1

  estate.save()

  let estateNFT = NFT.load(id)
  estateNFT.searchEstateSize = estate.size
  estateNFT.save()

  let parcel = Parcel.load(parcelId)

  // Would expect that this isn't needed, but it is here for safety, since failing at block 6,000,000 slows down iterative testing
  // Because if land parcel doesn't exist, we get a crashed node
  if (parcel == null) {
    let coordinates = decodeTokenId(event.params._landId)

    parcel = new Parcel(parcelId)
    parcel.x = coordinates[0]
    parcel.y = coordinates[1]
    parcel.tokenId = event.params._landId
  }

  parcel.owner = event.params._destinatary.toHex()
  parcel.estate = null
  parcel.save()

  let parcelNFT = new NFT(parcelId)
  parcelNFT.searchParcelEstateId = null
  parcelNFT.owner = event.params._destinatary.toHex()
  parcelNFT.save()

  if (estateNFT != null && estate != null) {
    if (shouldRecalculateMinDistance(parcel, estate, estateNFT)) {
      // parcelDistances is an ordered array, so we just need to remove the first element
      let distances = estate.parcelDistances!
      distances.shift()
      estate.parcelDistances = distances
      estate.save()

      estateNFT.searchDistanceToPlaza = distances[0] || -1
    }

    let adjacentToRoad = getAdjacentToRoad(parcel!)
    if (adjacentToRoad) {
      estate.adjacentToRoadCount -= 1
      estate.save()

      estateNFT.searchAdjacentToRoad = estate.adjacentToRoadCount > 0
    }
    estateNFT.save()
  }
}

export function handleUpdate(event: Update): void {
  // TODO: Code really similar to handleCreateEstate
  let estateId = event.params._assetId.toString()

  let data = event.params._data.toString()
  let id = getNFTId(categories.ESTATE, addresses.EstateRegistry, estateId)

  let estate = new Estate(id)
  estate.rawData = data

  let estateData = buildData(id, data, DataType.ESTATE)
  if (estateData != null) {
    estate.data = id
    estateData.save()

    let nft = new NFT(id)
    nft.name = estateData.name
    nft.searchText = toLowerCase(estateData.name)
    nft.updatedAt = event.block.timestamp
    nft.save()
  }

  estate.save()
}
