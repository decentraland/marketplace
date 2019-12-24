import {
  Transfer,
  Update,
  Approval,
  UpdateManager,
  UpdateOperator,
  ApprovalForAll
} from '../entities/LANDRegistry/LANDRegistry'
import { Parcel, Authorization } from '../entities/schema'
import {
  AuthorizationTypes,
  getAuthorizationId
} from '../modules/authorization'
import { createWallet } from '../modules/wallet'
import { buildData, DataType } from '../modules/data'

export function handleUpdate(event: Update): void {
  let parcelId = event.params.assetId.toHex()
  let data = event.params.data.toString()

  let parcel = new Parcel(parcelId)
  parcel.rawData = data

  let parcelData = buildData(parcelId, data, DataType.PARCEL)
  if (parcelData != null) {
    parcel.data = parcelData.id
    parcelData.save()
  }

  parcel.save()
}

export function handleApproval(event: Approval): void {
  let id = event.params.assetId.toHex()
  let parcel = new Parcel(id)

  parcel.operator = event.params.operator

  parcel.save()
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
  let id = event.params.assetId.toHex()
  let parcel = new Parcel(id)

  parcel.updateOperator = event.params.operator

  parcel.save()
}

export function handleApprovalForAll(event: ApprovalForAll): void {
  let id = getAuthorizationId(event, AuthorizationTypes.operator)
  let authorization = new Authorization(id)

  authorization.type = AuthorizationTypes.operator
  authorization.owner = event.params.holder.toHex()
  authorization.operator = event.params.operator
  authorization.tokenAddress = event.address

  authorization.save()

  createWallet(event.params.holder.toHex())
}
