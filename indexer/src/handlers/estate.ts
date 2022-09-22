import { BigInt, ValueKind } from '@graphprotocol/graph-ts'
import {
  CreateEstate,
  AddLand,
  RemoveLand,
  Update,
} from '../entities/EstateRegistry/EstateRegistry'
import { NFT, Parcel, Estate } from '../entities/schema'
import { getNFTId } from '../modules/nft'
import { decodeTokenId } from '../modules/parcel'
import { buildData, DataType } from '../modules/data'
import { createOrLoadAccount } from '../modules/account'
import { toLowerCase } from '../modules/utils'
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
  estate.size = 0

  let estateData = buildData(id, data, DataType.ESTATE)
  if (estateData != null) {
    estate.data = id
    estateData.save()

    let nft = new NFT(id)
    nft.name = estateData.name
    nft.searchText = toLowerCase(estateData.name)
    nft.createdAt = event.block.timestamp
    nft.updatedAt = event.block.timestamp
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
  parcel.save()

  let parcelNFT = new NFT(parcelId)
  parcelNFT.searchParcelEstateId = id
  parcelNFT.owner = addresses.EstateRegistry
  parcelNFT.save()
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
    nft.updatedAt = event.block.timestamp
    nft.save()
  }

  estate.save()
}
