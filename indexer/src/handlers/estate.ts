import {
  CreateEstate,
  AddLand,
  RemoveLand,
  Update
} from '../entities/EstateRegistry/EstateRegistry'
import { NFT, Parcel, Estate } from '../entities/schema'
import { getNFTId } from '../modules/nft'
import { decodeTokenId } from '../modules/parcel'
import { createWallet } from '../modules/wallet'
import { buildData, DataType } from '../modules/data'
import * as categories from '../modules/category/categories'

export function handleCreateEstate(event: CreateEstate): void {
  let estateId = event.params._estateId.toString()
  let data = event.params._data.toString()

  let id = getNFTId(estateId, categories.ESTATE)

  let estate = new Estate(id)

  estate.tokenId = event.params._estateId
  estate.owner = event.params._owner.toHex()
  estate.rawData = data
  estate.parcels = []
  estate.size = 0

  let estateData = buildData(id, data, DataType.ESTATE)
  if (estateData != null) {
    estate.data = id
    estateData.save()

    let nft = new NFT(id)
    nft.name = estateData.name
    nft.save()
  }

  estate.save()

  createWallet(event.params._owner.toHex())
}

export function handleAddLand(event: AddLand): void {
  let estateId = event.params._estateId.toString()

  let id = getNFTId(estateId, categories.ESTATE)
  let parcelId = getNFTId(event.params._landId.toString(), categories.PARCEL)

  let estate = Estate.load(id)

  let parcels = estate.parcels
  parcels.push(parcelId)

  estate.parcels = parcels
  estate.size = parcels.length
  estate.save()

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

  parcel.owner = estate.owner
  parcel.estate = id
  parcel.save()

  let nft = new NFT(parcelId)
  nft.owner = estate.owner
  nft.save()
}

export function handleRemoveLand(event: RemoveLand): void {
  let estateId = event.params._estateId.toString()

  let id = getNFTId(estateId, categories.ESTATE)
  let parcelId = getNFTId(event.params._landId.toString(), categories.PARCEL)

  let estate = Estate.load(id)

  let parcels = estate.parcels
  let index = parcels.indexOf(parcelId)
  parcels.splice(index, 1)

  estate.parcels = parcels
  estate.size = parcels.length
  estate.save()

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

  let nft = new NFT(parcelId)
  nft.owner = event.params._destinatary.toHex()
  nft.save()
}

export function handleUpdate(event: Update): void {
  // TODO: Code really similar to handleCreateEstate
  let estateId = event.params._assetId.toString()

  let data = event.params._data.toString()
  let id = getNFTId(estateId, categories.ESTATE)

  let estate = new Estate(id)
  estate.rawData = data

  let estateData = buildData(id, data, DataType.ESTATE)
  if (estateData != null) {
    estate.data = id
    estateData.save()

    let nft = new NFT(id)
    nft.name = estateData.name
    nft.save()
  }

  estate.save()
}
