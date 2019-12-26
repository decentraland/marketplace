import { Update } from '../entities/LANDRegistry/LANDRegistry'
import { Parcel } from '../entities/schema'
import { getNFTId } from '../modules/nft'
import { buildData, DataType } from '../modules/data'
import * as categories from '../modules/category/categories'

export function handleUpdate(event: Update): void {
  let parcelId = event.params.assetId.toString()
  let data = event.params.data.toString()

  let id = getNFTId(parcelId, categories.PARCEL)

  let parcel = new Parcel(id)
  parcel.rawData = data

  let parcelData = buildData(id, data, DataType.PARCEL)
  if (parcelData != null) {
    parcel.data = id
    parcelData.save()
  }

  parcel.save()
}
