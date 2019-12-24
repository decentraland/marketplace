import {
  CreateEstate,
  AddLand,
  RemoveLand,
  Transfer,
  Update,
  Approval,
  UpdateManager,
  UpdateOperator,
  ApprovalForAll
} from '../entities/EstateRegistry/EstateRegistry'
import { NFT, Parcel, Estate, Authorization } from '../entities/schema'
import {
  AuthorizationTypes,
  getAuthorizationId
} from '../modules/authorization'
import { decodeTokenId } from '../modules/parcel'
import { createWallet } from '../modules/wallet'
import { buildData, DataType } from '../modules/data'

export function handleCreateEstate(event: CreateEstate): void {
  let estateId = event.params._estateId.toString()
  let data = event.params._data.toString()

  let estate = new Estate(estateId)

  estate.owner = event.params._owner.toHex()
  estate.rawData = data
  estate.parcels = []
  estate.size = 0

  let estateData = buildData(estateId, data, DataType.ESTATE)
  if (estateData != null) {
    estate.data = estateData.id
    estateData.save()
  }

  estate.save()

  createWallet(event.params._owner.toHex())
}

export function handleAddLand(event: AddLand): void {
  let estateId = event.params._estateId.toString()
  let parcelId = event.params._landId.toHex()
  let estate = Estate.load(estateId)

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
  parcel.estate = estateId
  parcel.save()

  let nft = new NFT(parcelId)
  nft.owner = estate.owner
  nft.save()
}

export function handleRemoveLand(event: RemoveLand): void {
  let estateId = event.params._estateId.toString()
  let parcelId = event.params._landId.toHex()
  let estate = Estate.load(estateId)

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
  let estateId = event.params._assetId.toHex()
  let data = event.params._data.toString()

  let estate = new Estate(estateId)
  estate.rawData = data

  let estateData = buildData(estateId, data, DataType.ESTATE)
  if (estateData != null) {
    estate.data = estateData.id
    estateData.save()
  }

  estate.save()
}

export function handleApproval(event: Approval): void {
  let id = event.params._tokenId.toString()
  let estate = new Estate(id)

  estate.owner = event.params._owner.toHex()
  estate.operator = event.params._approved

  estate.save()
}

export function handleUpdateManager(event: UpdateManager): void {
  let id = getAuthorizationId(event, AuthorizationTypes.manager)
  let authorization = new Authorization(id)

  authorization.type = AuthorizationTypes.manager
  authorization.owner = event.params._owner.toHex()
  authorization.operator = event.params._operator
  authorization.tokenAddress = event.address

  authorization.save()

  createWallet(event.params._owner.toHex())
}

export function handleUpdateOperator(event: UpdateOperator): void {
  let id = event.params._estateId.toString()
  let estate = new Estate(id)

  estate.operator = event.params._operator

  estate.save()
}

export function handleApprovalForAll(event: ApprovalForAll): void {
  let id = getAuthorizationId(event, AuthorizationTypes.operator)
  let authorization = new Authorization(id)

  authorization.type = AuthorizationTypes.operator
  authorization.owner = event.params._owner.toHex()
  authorization.operator = event.params._operator
  authorization.tokenAddress = event.address

  authorization.save()

  createWallet(event.params._owner.toHex())
}
